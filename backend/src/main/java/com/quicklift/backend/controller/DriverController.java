package com.quicklift.backend.controller;

import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.DriverStatus;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.service.TripService;
import com.quicklift.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @Autowired
    private DriverRepository driverRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/available-trips")
    public ResponseEntity<List<Trip>> getAvailableTrips() {
        // In a real app, you might want to filter by proximity to the driver
        List<Trip> availableTrips = tripService.findByStatus(TripStatus.REQUESTED);
        return ResponseEntity.ok(availableTrips);
    }

    @PostMapping("/trips/{tripId}/accept")
    public ResponseEntity<?> acceptTrip(@PathVariable Long tripId) {
        try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));

            Trip acceptedTrip = tripService.acceptTrip(tripId, driver.getId());
            return ResponseEntity.ok(acceptedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/trips/{tripId}/start")
    public ResponseEntity<?> startTrip(@PathVariable Long tripId) {
         try {
            Trip startedTrip = tripService.startTrip(tripId);
            return ResponseEntity.ok(startedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/trips/{tripId}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long tripId, @RequestParam BigDecimal finalFare) {
        try {
            Trip completedTrip = tripService.completeTrip(tripId, finalFare);
            return ResponseEntity.ok(completedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-active-trip")
    public ResponseEntity<?> getMyActiveTrip() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        
        List<TripStatus> activeStatuses = List.of(TripStatus.ACCEPTED, TripStatus.STARTED);
        
        Optional<Trip> activeTrip = tripService.findByDriverId(driver.getId())
            .stream()
            .filter(trip -> activeStatuses.contains(trip.getStatus()))
            .findFirst();

        return ResponseEntity.ok(activeTrip.orElse(null));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<?> getMyTrips() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        
        List<Trip> trips = tripService.findByDriverId(driver.getId());
        return ResponseEntity.ok(trips);
    }

    @PostMapping("/set-status")
    public ResponseEntity<?> setDriverStatus(@RequestParam DriverStatus status) {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        driver.setStatus(status);
        driverRepository.save(driver);
        return ResponseEntity.ok(driver);
    }

    @PostMapping("/trips/{tripId}/reject")
    public ResponseEntity<?> rejectTrip(@PathVariable Long tripId) {
        try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
            Trip rejectedTrip = tripService.rejectTrip(tripId, driver.getId());
            return ResponseEntity.ok(rejectedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/online")
    public ResponseEntity<?> getOnlineDrivers() {
        List<Driver> onlineDrivers = driverRepository.findByStatus(com.quicklift.backend.model.DriverStatus.ONLINE);
        return ResponseEntity.ok(onlineDrivers);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDriverSummary() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        // Calculate total earnings and average rating
        double earnings = driver.getTrips().stream()
                .filter(trip -> trip.getStatus() == com.quicklift.backend.model.TripStatus.COMPLETED && trip.getFare() != null)
                .mapToDouble(trip -> trip.getFare().doubleValue())
                .sum();
        double avgRating = driver.getTrips().stream()
                .filter(trip -> trip.getStatus() == com.quicklift.backend.model.TripStatus.COMPLETED && trip.getRating() != null)
                .mapToDouble(trip -> trip.getRating().doubleValue())
                .average().orElse(0.0);
        return ResponseEntity.ok(java.util.Map.of(
            "earnings", earnings,
            "rating", avgRating
        ));
    }
} 