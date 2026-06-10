package com.quicklift.backend.controller;

import com.quicklift.backend.dto.FareResponse;
import com.quicklift.backend.dto.PaymentRequest;
import com.quicklift.backend.dto.TripMessageResponse;
import com.quicklift.backend.dto.TripRequest;
import com.quicklift.backend.dto.TripResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.service.FareService;
import com.quicklift.backend.service.PaymentService;
import com.quicklift.backend.service.TripMessageService;
import com.quicklift.backend.service.TripService;
import com.quicklift.backend.service.UserService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/trips", "/api/trips"})
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    @Autowired
    private FareService fareService;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private TripMessageService tripMessageService;

    @PostMapping("/estimate")
    public ResponseEntity<?> estimateFare(@Valid @RequestBody TripRequest tripRequest) {
        try {
            double distance = fareService.calculateDistance(
                tripRequest.getPickupLatitude().doubleValue(),
                tripRequest.getPickupLongitude().doubleValue(),
                tripRequest.getDestinationLatitude().doubleValue(),
                tripRequest.getDestinationLongitude().doubleValue()
            );
            BigDecimal estimatedFare = fareService.calculateFare(tripRequest);
            return ResponseEntity.ok(new FareResponse(estimatedFare, distance));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while estimating the fare.");
        }
    }

    @PostMapping({"", "/book"})
    public ResponseEntity<?> bookTrip(@Valid @RequestBody TripRequest tripRequest) {
        try {
            Optional<User> user = userService.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            BigDecimal fare = fareService.calculateFare(tripRequest);

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
            trip.setFare(fare);
            trip.setPaymentMethod(tripRequest.getPaymentMethod());

            Trip createdTrip = tripService.createTrip(trip);
            return ResponseEntity.ok(TripResponse.from(createdTrip));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-trips")
    public ResponseEntity<?> getMyTrips() {
        User user = currentUser();
        return ResponseEntity.ok(tripService.findByUserId(user.getId()).stream().map(TripResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        Optional<Trip> trip = tripService.findById(id);
        if (trip.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        requireTripViewAccess(trip.get(), currentUser());
        return ResponseEntity.ok(TripResponse.from(trip.get()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getTripChatMessages(@PathVariable Long id) {
        Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        requireTripViewAccess(trip, currentUser());
        return ResponseEntity.ok(tripMessageService.findByTrip(id, currentUser()).stream()
            .map(TripMessageResponse::from)
            .toList());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        try {
            Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
            requireTripCancelAccess(trip, currentUser());
            return ResponseEntity.ok(TripResponse.from(tripService.cancelTrip(id)));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping({"/{id}/rate", "/{id}/rating"})
    public ResponseEntity<?> rateTrip(@PathVariable Long id,
                                      @RequestParam BigDecimal rating,
                                      @RequestParam(required = false) String review) {
        try {
            Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
            requireTripOwnerAccess(trip, currentUser());
            return ResponseEntity.ok(TripResponse.from(tripService.rateTrip(id, rating, review)));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTripsByStatus(@PathVariable TripStatus status) {
        return ResponseEntity.ok(tripService.findByStatus(status).stream().map(TripResponse::from).toList());
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTripsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.findByDriverId(driverId).stream().map(TripResponse::from).toList());
    }

    @PostMapping("/request-to-driver")
    public ResponseEntity<?> requestToDriver(@RequestBody TripRequest tripRequest, @RequestParam Long driverId) {
        try {
            Optional<User> user = userService.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            Trip trip = tripService.createTripForDriver(tripRequest, user.get(), driverId);
            return ResponseEntity.ok(TripResponse.from(trip));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/request-driver")
    public ResponseEntity<?> requestExistingTripToDriver(@PathVariable Long id, @RequestParam Long driverId) {
        try {
            Trip trip = tripService.requestExistingTripToDriver(id, driverId, currentUser());
            return ResponseEntity.ok(TripResponse.from(trip));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<?> payForTrip(@PathVariable Long id) {
        try {
            Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
            requireTripOwnerAccess(trip, currentUser());
            PaymentRequest request = new PaymentRequest();
            request.setTripId(id);
            request.setMethod(trip.getPaymentMethod() == null ? "CASH" : trip.getPaymentMethod());
            paymentService.createSimulatedPayment(request, currentUser());
            Trip paidTrip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
            return ResponseEntity.ok(TripResponse.from(paidTrip));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/payment-method")
    public ResponseEntity<?> updatePaymentMethod(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
            requireTripOwnerAccess(trip, currentUser());
            Trip updatedTrip = tripService.updatePaymentMethod(id, body.get("paymentMethod"));
            return ResponseEntity.ok(TripResponse.from(updatedTrip));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> acceptTrip(@PathVariable Long id) {
        Driver driver = currentDriver();
        return ResponseEntity.ok(TripResponse.from(tripService.acceptTrip(id, driver.getId())));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> startTrip(@PathVariable Long id) {
        Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        requireAssignedDriverAccess(trip, currentDriver());
        return ResponseEntity.ok(TripResponse.from(tripService.startTrip(id)));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> completeTrip(@PathVariable Long id, @RequestParam BigDecimal finalFare) {
        Trip trip = tripService.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        requireAssignedDriverAccess(trip, currentDriver());
        return ResponseEntity.ok(TripResponse.from(tripService.completeTrip(id, finalFare)));
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Driver currentDriver() {
        User user = currentUser();
        return driverRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Driver profile not found"));
    }

    private void requireTripViewAccess(Trip trip, User user) {
        if (user.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(user.getId())) {
            return;
        }
        if (trip.getDriver() != null && trip.getDriver().getUser().getId().equals(user.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot access this trip");
    }

    private void requireTripOwnerAccess(Trip trip, User user) {
        if (user.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(user.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot modify this trip");
    }

    private void requireTripCancelAccess(Trip trip, User user) {
        if (user.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(user.getId())) {
            return;
        }
        if (trip.getDriver() != null && trip.getDriver().getUser().getId().equals(user.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot cancel this trip");
    }

    private void requireAssignedDriverAccess(Trip trip, Driver driver) {
        if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Driver is not assigned to this trip");
        }
    }
}
