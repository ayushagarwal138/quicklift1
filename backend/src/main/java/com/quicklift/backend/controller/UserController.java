package com.quicklift.backend.controller;

import com.quicklift.backend.dto.UserResponse;
import com.quicklift.backend.model.User;
import com.quicklift.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/v1/users", "/api/users"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping({"/profile", "/me"})
    public ResponseEntity<?> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userService.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(UserResponse.from(user.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(UserResponse.from(user.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping({"/profile", "/me"})
    public ResponseEntity<?> updateProfile(@RequestBody User userDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> currentUser = userService.findByUsername(username);
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(UserResponse.from(updatedUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping({"/profile/picture", "/me/profile-picture"})
    public ResponseEntity<?> updateProfilePicture(@RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> currentUser = userService.findByUsername(username);
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            user.setProfilePictureUrl(payload.get("profilePictureUrl"));
            
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(UserResponse.from(updatedUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.findAllUsers().stream()
            .map(UserResponse::from)
            .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userService.findById(id).isPresent()) {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 
