package com.quicklift.backend.dto;

import com.quicklift.backend.model.Notification;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String type;
    private String title;
    private String message;
    private String targetUrl;
    private Long tripId;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setTargetUrl(notification.getTargetUrl());
        response.setTripId(notification.getTripId());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
