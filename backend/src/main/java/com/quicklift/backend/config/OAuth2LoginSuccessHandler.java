package com.quicklift.backend.config;

import com.quicklift.backend.model.User;
import com.quicklift.backend.service.AuthCookieService;
import com.quicklift.backend.service.OAuthAccountService;
import com.quicklift.backend.service.RefreshTokenService;
import com.quicklift.backend.util.JwtTokenUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final OAuthAccountService oauthAccountService;
    private final JwtTokenUtil jwtTokenUtil;
    private final RefreshTokenService refreshTokenService;
    private final AuthCookieService authCookieService;

    @Value("${app.auth.frontend-success-url:http://localhost:5173}")
    private String frontendSuccessUrl;

    public OAuth2LoginSuccessHandler(
        OAuthAccountService oauthAccountService,
        JwtTokenUtil jwtTokenUtil,
        RefreshTokenService refreshTokenService,
        AuthCookieService authCookieService
    ) {
        this.oauthAccountService = oauthAccountService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.refreshTokenService = refreshTokenService;
        this.authCookieService = authCookieService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String subject = principal.getAttribute("sub");
        String email = principal.getAttribute("email");
        Boolean emailVerified = principal.getAttribute("email_verified");
        String firstName = principal.getAttribute("given_name");
        String lastName = principal.getAttribute("family_name");

        User user = oauthAccountService.linkOrCreateGoogleUser(subject, email, Boolean.TRUE.equals(emailVerified), firstName, lastName);
        String accessToken = jwtTokenUtil.generateToken(user.getUsername(), List.of(user.getRole().name()));
        RefreshTokenService.IssuedRefreshToken refreshToken = refreshTokenService.issue(user);
        authCookieService.addRefreshCookie(response, refreshToken.value(), refreshToken.expiresAt());

        String redirect = UriComponentsBuilder.fromUriString(frontendSuccessUrl)
            .fragment("accessToken=" + accessToken)
            .build()
            .toUriString();
        response.sendRedirect(redirect);
    }
}
