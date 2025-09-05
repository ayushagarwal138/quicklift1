package com.quicklift.backend.controller;

import com.quicklift.backend.dto.NotificationResponse;
import com.quicklift.backend.model.User;
import com.quicklift.backend.service.NotificationService;
import com.quicklift.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/notifications", "/api/notifications"})
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> listNotifications() {
        return ResponseEntity.ok(notificationService.findForUser(currentUser()).stream()
            .map(NotificationResponse::from)
            .toList());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount() {
        return ResponseEntity.ok(Map.of("count", notificationService.unreadCount(currentUser())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(NotificationResponse.from(notificationService.markRead(id, currentUser())));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllRead() {
        notificationService.markAllRead(currentUser());
        return ResponseEntity.ok(Map.of("count", 0));
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
