package com.quicklift.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quicklift.backend.dto.ApiError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private static final long WINDOW_MILLIS = 60_000;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public RateLimitFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        int limit = limitFor(request.getRequestURI());
        if (limit > 0 && !allow(request, limit)) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Object requestId = request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE);
            objectMapper.writeValue(response.getOutputStream(),
                new ApiError(429, "RATE_LIMITED", "Too many requests. Please try again shortly.",
                    requestId != null ? requestId.toString() : null, null));
            return;
        }
        filterChain.doFilter(request, response);
    }

    private int limitFor(String path) {
        if (path.contains("/auth/login") || path.contains("/auth/register")) {
            return 10;
        }
        if (path.contains("/auth/check-username") || path.contains("/auth/check-email")) {
            return 30;
        }
        if (path.contains("/locations/") || path.contains("/trips/estimate")) {
            return 60;
        }
        return 0;
    }

    private boolean allow(HttpServletRequest request, int limit) {
        String key = request.getRemoteAddr() + ":" + request.getRequestURI();
        long now = Instant.now().toEpochMilli();
        Bucket bucket = buckets.compute(key, (ignored, existing) -> {
            if (existing == null || now - existing.windowStartedAt > WINDOW_MILLIS) {
                return new Bucket(now);
            }
            return existing;
        });
        return bucket.count.incrementAndGet() <= limit;
    }

    private static class Bucket {
        private final long windowStartedAt;
        private final AtomicInteger count = new AtomicInteger();

        private Bucket(long windowStartedAt) {
            this.windowStartedAt = windowStartedAt;
        }
    }
}
