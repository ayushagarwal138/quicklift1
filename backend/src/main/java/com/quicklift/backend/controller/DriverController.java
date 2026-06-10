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
import java.math.RoundingMode;
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
        
        Object[] aggregate = (Object[]) tripRepository.getDriverSummaryAggregate(driver.getId());
        
        BigDecimal earnings = BigDecimal.ZERO;
        BigDecimal rating = BigDecimal.ZERO;
        long activeTrips = 0L;
        long pendingRequests = 0L;
        long historyTrips = 0L;

        if (aggregate != null && aggregate.length >= 5) {
            earnings = toBigDecimal(aggregate[0]);
            rating = toBigDecimal(aggregate[1]);
            activeTrips = toLong(aggregate[2]);
            pendingRequests = toLong(aggregate[3]);
            historyTrips = toLong(aggregate[4]);
        }

        // Fallback: if aggregate earnings is zero, compute from completed trips directly
        if (earnings.compareTo(BigDecimal.ZERO) == 0) {
            List<Trip> driverTrips = tripRepository.findByDriverId(driver.getId());
            BigDecimal computedEarnings = driverTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getFare() != null)
                .map(Trip::getFare)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (computedEarnings.compareTo(BigDecimal.ZERO) > 0) {
                earnings = computedEarnings;
            }
            // Also compute rating from completed trips if aggregate returned 0
            if (rating.compareTo(BigDecimal.ZERO) == 0) {
                double avgRating = driverTrips.stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getRating() != null)
                    .mapToDouble(t -> t.getRating().doubleValue())
                    .average()
                    .orElse(0.0);
                rating = BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP);
            }
        }

        // Fallback: if aggregate pendingRequests is zero, count directly
        if (pendingRequests == 0) {
            long directCount = tripRepository.findByStatus(TripStatus.REQUESTED).stream()
                .filter(t -> t.getDriver() == null || t.getDriver().getId().equals(driver.getId()))
                .count();
            if (directCount > 0) {
                pendingRequests = directCount;
            }
        }

        return ResponseEntity.ok(new DriverSummaryResponse(earnings, rating, activeTrips, pendingRequests, historyTrips));
    }

    private static BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number num) return BigDecimal.valueOf(num.doubleValue());
        try {
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private static long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number num) return num.longValue();
        try {
            return Long.parseLong(value.toString());
        } catch (Exception e) {
            return 0L;
        }
    }
}
