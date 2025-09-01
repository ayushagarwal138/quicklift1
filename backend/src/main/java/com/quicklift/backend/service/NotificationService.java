package com.quicklift.backend.service;

import com.quicklift.backend.dto.NotificationResponse;
import com.quicklift.backend.model.Notification;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Notification create(User user, String type, String title, String message, String targetUrl, Long tripId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetUrl(targetUrl);
        notification.setTripId(tripId);

        Notification saved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/user/" + user.getId() + "/notifications", NotificationResponse.from(saved));
        return saved;
    }

    public List<Notification> findForUser(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public long unreadCount(User user) {
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public Notification markRead(Long notificationId, User actor) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        requireAccess(notification, actor);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public List<Notification> markAllRead(User user) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(user.getId());
        unread.forEach(notification -> notification.setRead(true));
        return notificationRepository.saveAll(unread);
    }

    private void requireAccess(Notification notification, User actor) {
        if (actor.getRole() == UserRole.ADMIN || notification.getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot access this notification");
    }
}
