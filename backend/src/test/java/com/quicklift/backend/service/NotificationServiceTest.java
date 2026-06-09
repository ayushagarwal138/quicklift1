package com.quicklift.backend.service;

import com.quicklift.backend.model.Notification;
import com.quicklift.backend.dto.NotificationResponse;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {
    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void createPersistsAndPublishesNotification() {
        User user = user(7L, UserRole.USER);
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification notification = invocation.getArgument(0);
            notification.setId(42L);
            return notification;
        });

        Notification notification = notificationService.create(
            user,
            "TRIP_ACCEPTED",
            "Ride accepted",
            "A driver accepted your ride.",
            "/trips/12/confirm",
            12L
        );

        assertThat(notification.getId()).isEqualTo(42L);
        assertThat(notification.isRead()).isFalse();
        verify(messagingTemplate).convertAndSend(eq("/topic/user/7/notifications"), any(NotificationResponse.class));
    }

    @Test
    void unreadCountUsesCurrentUser() {
        User user = user(7L, UserRole.USER);
        when(notificationRepository.countByUserIdAndReadFalse(7L)).thenReturn(3L);

        assertThat(notificationService.unreadCount(user)).isEqualTo(3L);
    }

    @Test
    void markReadRejectsNotificationsOwnedByAnotherUser() {
        Notification notification = new Notification();
        notification.setId(10L);
        notification.setUser(user(1L, UserRole.USER));
        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));

        assertThatThrownBy(() -> notificationService.markRead(10L, user(2L, UserRole.USER)))
            .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void markAllReadUpdatesUnreadNotifications() {
        User user = user(7L, UserRole.USER);
        Notification first = notification(user);
        Notification second = notification(user);
        when(notificationRepository.findByUserIdAndReadFalse(7L)).thenReturn(List.of(first, second));

        notificationService.markAllRead(user);

        assertThat(first.isRead()).isTrue();
        assertThat(second.isRead()).isTrue();
        verify(notificationRepository).saveAll(List.of(first, second));
    }

    private static Notification notification(User user) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType("TEST");
        notification.setTitle("Title");
        notification.setMessage("Message");
        notification.setTargetUrl("/history");
        return notification;
    }

    private static User user(Long id, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setUsername("user" + id);
        return user;
    }
}
