package com.rideshare.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import com.rideshare.backend.util.JwtTokenUtil;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.ArrayList;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Topic for broadcasting messages from server to clients
        registry.enableSimpleBroker("/topic"); 
        // Prefix for messages bound for @MessageMapping-annotated methods
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The endpoint for WebSocket connections
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173", "http://localhost:3000")
                .addInterceptors(new JwtHandshakeInterceptor())
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null) {
                    Object authAttr = accessor.getSessionAttributes() != null ? accessor.getSessionAttributes().get("Authorization") : null;
                    if (authAttr instanceof String authHeader && authHeader.startsWith("Bearer ")) {
                        String jwt = authHeader.substring(7);
                        String username = jwtTokenUtil.extractUsername(jwt);
                        if (username != null && jwtTokenUtil.validateToken(jwt)) {
                            // Extract roles from JWT
                            List<GrantedAuthority> authorities = new ArrayList<>();
                            try {
                                Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                                        .setSigningKey(jwtTokenUtil.getClass().getDeclaredField("secret").get(jwtTokenUtil).toString().getBytes())
                                        .build()
                                        .parseClaimsJws(jwt)
                                        .getBody();
                                Object rolesObj = claims.get("roles");
                                if (rolesObj instanceof List rolesList) {
                                    for (Object role : rolesList) {
                                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toString()));
                                    }
                                } else if (rolesObj instanceof String roleStr) {
                                    authorities.add(new SimpleGrantedAuthority("ROLE_" + roleStr));
                                }
                            } catch (Exception e) {
                                // fallback: no roles
                            }
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(username, null, authorities);
                            accessor.setUser(authentication);
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
                return message;
            }
        });
    }

    // JwtHandshakeInterceptor extracts the Authorization header from the handshake
    public static class JwtHandshakeInterceptor implements HandshakeInterceptor {
        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                       WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
            String authHeader = request.getHeaders().getFirst("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                attributes.put("Authorization", authHeader);
            }
            return true;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                  WebSocketHandler wsHandler, Exception exception) {
        }
    }
} 