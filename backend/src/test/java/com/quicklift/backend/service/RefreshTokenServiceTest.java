package com.quicklift.backend.service;

import com.quicklift.backend.model.RefreshToken;
import com.quicklift.backend.model.User;
import com.quicklift.backend.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp() {
        refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    }

    @Test
    void rotateReturnsUserAndRevokesRefreshToken() {
        User user = new User();
        RefreshToken token = refreshToken(user, LocalDateTime.now().plusDays(1));
        when(refreshTokenRepository.findByTokenHash(refreshTokenService.hash("valid-token")))
            .thenReturn(Optional.of(token));

        User rotatedUser = refreshTokenService.rotate("valid-token");

        assertSame(user, rotatedUser);
        assertTrue(token.getRevokedAt() != null);
        verify(refreshTokenRepository).save(token);
    }

    @Test
    void rotateRejectsUnknownRefreshTokenAsAuthenticationFailure() {
        when(refreshTokenRepository.findByTokenHash(refreshTokenService.hash("missing-token")))
            .thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> refreshTokenService.rotate("missing-token"));
    }

    @Test
    void rotateRejectsExpiredRefreshTokenAsAuthenticationFailure() {
        RefreshToken token = refreshToken(new User(), LocalDateTime.now().minusMinutes(1));
        when(refreshTokenRepository.findByTokenHash(refreshTokenService.hash("expired-token")))
            .thenReturn(Optional.of(token));

        assertThrows(BadCredentialsException.class, () -> refreshTokenService.rotate("expired-token"));
        verify(refreshTokenRepository).findByTokenHash(any());
    }

    private static RefreshToken refreshToken(User user, LocalDateTime expiresAt) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setExpiresAt(expiresAt);
        return token;
    }
}
