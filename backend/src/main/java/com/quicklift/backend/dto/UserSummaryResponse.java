package com.quicklift.backend.dto;

import com.quicklift.backend.model.User;

public class UserSummaryResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private String role;

    public static UserSummaryResponse from(User user) {
        if (user == null) {
            return null;
        }
        UserSummaryResponse response = new UserSummaryResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setRole(user.getRole().name());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
