package com.quicklift.backend.controller;

import com.quicklift.backend.dto.DriverResponse;
import com.quicklift.backend.dto.DriverSummaryResponse;
import com.quicklift.backend.dto.TripResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.DriverStatus;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import com.quicklift.backend.model.User;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.repository.TripRepository;
import com.quicklift.backend.service.TripService;
import com.quicklift.backend.service.UserService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/drivers", "/api/driver"})
public class DriverController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/available-trips")
    public ResponseEntity<List<TripResponse>> getAvailableTrips() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        List<Trip> availableTrips = tripService.findByStatus(TripStatus.REQUESTED).stream()
            .filter(trip -> trip.getDriver() == null || trip.getDriver().getId().equals(driver.getId()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(availableTrips.stream().map(TripResponse::from).toList());
    }

    @PostMapping("/trips/{tripId}/accept")
    public ResponseEntity<?> acceptTrip(@PathVariable Long tripId) {
        try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
            return ResponseEntity.ok(TripResponse.from(tripService.acceptTrip(tripId, driver.getId())));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/trips/{tripId}/start")
    public ResponseEntity<?> startTrip(@PathVariable Long tripId) {
         try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
            Trip trip = tripService.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Driver is not assigned to this trip");
            }
            return ResponseEntity.ok(TripResponse.from(tripService.startTrip(tripId)));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/trips/{tripId}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long tripId, @RequestParam BigDecimal finalFare) {
        try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
            Trip trip = tripService.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Driver is not assigned to this trip");
            }
            return ResponseEntity.ok(TripResponse.from(tripService.completeTrip(tripId, finalFare)));
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
        return ResponseEntity.ok(activeTrip.map(TripResponse::from).orElse(null));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<?> getMyTrips() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        return ResponseEntity.ok(tripService.findByDriverId(driver.getId()).stream().map(TripResponse::from).toList());
    }

    @PostMapping("/set-status")
    public ResponseEntity<?> setDriverStatus(@RequestParam DriverStatus status) {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        driver.setStatus(status);
        driverRepository.save(driver);
        return ResponseEntity.ok(DriverResponse.from(driver));
    }

    @PostMapping("/trips/{tripId}/reject")
    public ResponseEntity<?> rejectTrip(@PathVariable Long tripId) {
        try {
            User user = getAuthenticatedUser();
            Driver driver = driverRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
            return ResponseEntity.ok(TripResponse.from(tripService.rejectTrip(tripId, driver.getId())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping({"/online", "/available"})
    public ResponseEntity<?> getOnlineDrivers() {
        return ResponseEntity.ok(driverRepository.findByStatus(DriverStatus.ONLINE).stream().map(DriverResponse::from).toList());
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDriverSummary() {
        User user = getAuthenticatedUser();
        Driver driver = driverRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Driver profile not found for the authenticated user."));
        Object[] aggregate = tripRepository.getDriverSummaryAggregate(driver.getId());
        BigDecimal earnings = aggregate[0] == null ? BigDecimal.ZERO : (BigDecimal) aggregate[0];
        BigDecimal rating = aggregate[1] == null ? BigDecimal.ZERO : (BigDecimal) aggregate[1];
        long activeTrips = aggregate[2] == null ? 0L : ((Number) aggregate[2]).longValue();
        long pendingRequests = aggregate[3] == null ? 0L : ((Number) aggregate[3]).longValue();
        long historyTrips = aggregate[4] == null ? 0L : ((Number) aggregate[4]).longValue();
        return ResponseEntity.ok(new DriverSummaryResponse(earnings, rating, activeTrips, pendingRequests, historyTrips));
    }
}
