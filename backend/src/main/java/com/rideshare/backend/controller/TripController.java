package com.rideshare.backend.controller;

import com.rideshare.backend.dto.TripRequest;
import com.rideshare.backend.model.Trip;
import com.rideshare.backend.model.TripStatus;
import com.rideshare.backend.model.User;
import com.rideshare.backend.service.TripService;
import com.rideshare.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTrip(@Valid @RequestBody TripRequest tripRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            Optional<User> user = userService.findByUsername(username);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Trip trip = new Trip();
            trip.setUser(user.get());
            trip.setPickupLocation(tripRequest.getPickupLocation());
            trip.setDestination(tripRequest.getDestination());
            trip.setRequestedVehicleType(tripRequest.getVehicleType());
            trip.setPickupLatitude(tripRequest.getPickupLatitude());
            trip.setPickupLongitude(tripRequest.getPickupLongitude());
            trip.setDestinationLatitude(tripRequest.getDestinationLatitude());
            trip.setDestinationLongitude(tripRequest.getDestinationLongitude());
            trip.setNotes(tripRequest.getNotes());

            Trip createdTrip = tripService.createTrip(trip);
            return ResponseEntity.ok(createdTrip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-trips")
    public ResponseEntity<?> getMyTrips() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userService.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Trip> trips = tripService.findByUserId(user.get().getId());
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        Optional<Trip> trip = tripService.findById(id);
        if (trip.isPresent()) {
            return ResponseEntity.ok(trip.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        try {
            Trip cancelledTrip = tripService.cancelTrip(id);
            return ResponseEntity.ok(cancelledTrip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateTrip(@PathVariable Long id, 
                                     @RequestParam BigDecimal rating,
                                     @RequestParam(required = false) String review) {
        try {
            Trip ratedTrip = tripService.rateTrip(id, rating, review);
            return ResponseEntity.ok(ratedTrip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getTripsByStatus(@PathVariable TripStatus status) {
        List<Trip> trips = tripService.findByStatus(status);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getTripsByDriver(@PathVariable Long driverId) {
        List<Trip> trips = tripService.findByDriverId(driverId);
        return ResponseEntity.ok(trips);
    }
} 