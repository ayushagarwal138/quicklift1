package com.quicklift.backend.service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class AuthCookieService {
    @Value("${app.auth.refresh-cookie-name:quicklift_refresh}")
    private String refreshCookieName;

    @Value("${app.auth.refresh-cookie-secure:true}")
    private boolean refreshCookieSecure;

    public String getRefreshCookieName() {
        return refreshCookieName;
    }

    public void addRefreshCookie(HttpServletResponse response, String token, LocalDateTime expiresAt) {
        long maxAgeSeconds = Math.max(0, expiresAt.toEpochSecond(ZoneOffset.UTC) - LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
        ResponseCookie cookie = ResponseCookie.from(refreshCookieName, token)
            .httpOnly(true)
            .secure(refreshCookieSecure)
            .sameSite(refreshCookieSecure ? "None" : "Lax")
            .path("/api/v1/auth")
            .maxAge(Duration.ofSeconds(maxAgeSeconds))
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(refreshCookieName, "")
            .httpOnly(true)
            .secure(refreshCookieSecure)
            .sameSite(refreshCookieSecure ? "None" : "Lax")
            .path("/api/v1/auth")
            .maxAge(Duration.ZERO)
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
