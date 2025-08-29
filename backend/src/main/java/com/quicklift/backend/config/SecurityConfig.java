package com.quicklift.backend.config;

import com.quicklift.backend.config.JwtAuthenticationEntryPoint;
import com.quicklift.backend.config.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtRequestFilter jwtRequestFilter,
            OAuth2LoginSuccessHandler oauth2LoginSuccessHandler
            , ObjectProvider<ClientRegistrationRepository> clientRegistrations
    ) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**", "/actuator/info").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/ws/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/register", "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh", "/api/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/auth/check-username", "/api/auth/check-username").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/auth/check-email", "/api/auth/check-email").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/auth/oauth2/**", "/api/auth/oauth2/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/v1/public/**", "/api/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/cities/**", "/api/cities/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/locations/**", "/api/locations/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/trips/estimate", "/api/trips/estimate").permitAll()
                .requestMatchers("/api/v1/admin/**", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/drivers/available", "/api/driver/online").authenticated()
                .requestMatchers("/api/v1/drivers/**", "/api/driver/**").hasRole("DRIVER")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        if (clientRegistrations.getIfAvailable() != null) {
            http.oauth2Login(oauth -> oauth.successHandler(oauth2LoginSuccessHandler));
        }

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isBlank())
            .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "X-Request-Id"));
        configuration.setExposedHeaders(List.of("Authorization", "X-Request-Id"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
