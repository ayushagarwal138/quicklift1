package com.quicklift.backend.dto;

import com.quicklift.backend.model.TripMessage;
import java.time.LocalDateTime;

public class TripMessageResponse {
    private Long id;
    private Long tripId;
    private Long senderUserId;
    private String senderUsername;
    private String senderRole;
    private String message;
    private LocalDateTime createdAt;

    public static TripMessageResponse from(TripMessage tripMessage) {
        TripMessageResponse response = new TripMessageResponse();
        response.setId(tripMessage.getId());
        response.setTripId(tripMessage.getTrip().getId());
        response.setSenderUserId(tripMessage.getSenderUser().getId());
        response.setSenderUsername(tripMessage.getSenderUser().getUsername());
        response.setSenderRole(tripMessage.getSenderUser().getRole().name());
        response.setMessage(tripMessage.getMessage());
        response.setCreatedAt(tripMessage.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Long getSenderUserId() { return senderUserId; }
    public void setSenderUserId(Long senderUserId) { this.senderUserId = senderUserId; }
    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }
    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
