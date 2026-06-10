package com.quicklift.backend.controller;

import com.quicklift.backend.dto.UserResponse;
import com.quicklift.backend.dto.DriverResponse;
import com.quicklift.backend.dto.TripResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/admin", "/api/admin"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.findAllUsers().stream()
            .map(UserResponse::from)
            .toList());
    }

    @GetMapping("/drivers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(adminService.findAllDrivers().stream().map(DriverResponse::from).toList());
    }

    @GetMapping("/trips")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TripResponse>> getAllTrips() {
        return ResponseEntity.ok(adminService.findAllTrips().stream().map(TripResponse::from).toList());
    }

    @DeleteMapping("/drivers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            adminService.deleteDriver(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 
