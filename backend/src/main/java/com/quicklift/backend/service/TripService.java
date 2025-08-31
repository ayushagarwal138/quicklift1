package com.quicklift.backend.service;

import com.quicklift.backend.dto.TripRequest;
import com.quicklift.backend.dto.TripResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.DriverStatus;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.VehicleType;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.repository.TripRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripService {
    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of("CASH", "CARD", "UPI", "WALLET");

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Trip createTrip(Trip trip) {
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(LocalDateTime.now());
        if (trip.getPaymentMethod() != null) {
            trip.setPaymentMethod(normalizePaymentMethod(trip.getPaymentMethod()));
        }
        return tripRepository.save(trip);
    }

    public Optional<Trip> findById(Long id) {
        return tripRepository.findById(id);
    }

    public List<Trip> findByUserId(Long userId) {
        return tripRepository.findByUserId(userId);
    }

    public List<Trip> findByDriverId(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }

    public List<Trip> findByStatus(TripStatus status) {
        return tripRepository.findByStatus(status);
    }

    public List<Trip> findByUserIdAndStatus(Long userId, TripStatus status) {
        return tripRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Trip> findByDriverIdAndStatus(Long driverId, TripStatus status) {
        return tripRepository.findByDriverIdAndStatus(driverId, status);
    }

    @Transactional
    public Trip acceptTrip(Long tripId, Long driverId) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new IllegalStateException("Trip is not available for acceptance");
        }
        if (trip.getDriver() != null && !trip.getDriver().getId().equals(driverId)) {
            throw new IllegalStateException("Trip is assigned to another driver");
        }
        if (driver.getStatus() != DriverStatus.ONLINE) {
            throw new IllegalStateException("Driver is not available");
        }

        trip.setDriver(driver);
        trip.setStatus(TripStatus.ACCEPTED);
        trip.setAcceptedAt(LocalDateTime.now());
        driver.setStatus(DriverStatus.BUSY);
        driverRepository.save(driver);

        Trip updatedTrip = tripRepository.save(trip);
        TripResponse payload = TripResponse.from(updatedTrip);
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", payload);
        messagingTemplate.convertAndSend("/topic/driver/" + driverId + "/status", payload);
        notificationService.create(
            trip.getUser(),
            "TRIP_ACCEPTED",
            "Ride accepted",
            driver.getUser().getUsername() + " accepted your ride request.",
            "/trips/" + tripId + "/confirm",
            tripId
        );
        return updatedTrip;
    }

    @Transactional
    public Trip startTrip(Long tripId) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new IllegalStateException("Trip is not accepted");
        }

        trip.setStatus(TripStatus.STARTED);
        trip.setStartedAt(LocalDateTime.now());
        Trip updatedTrip = tripRepository.save(trip);

        TripResponse payload = TripResponse.from(updatedTrip);
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", payload);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", payload);
        }
        notificationService.create(
            trip.getUser(),
            "TRIP_STARTED",
            "Trip started",
            "Your QuickLift trip is now in progress.",
            "/trips/" + tripId,
            tripId
        );
        return updatedTrip;
    }

    @Transactional
    public Trip completeTrip(Long tripId, BigDecimal fare) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() != TripStatus.STARTED) {
            throw new IllegalStateException("Trip is not started");
        }
        if (fare == null || fare.signum() <= 0) {
            throw new IllegalArgumentException("Final fare must be greater than zero");
        }

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        trip.setFare(fare);
        if (trip.getDriver() != null) {
            Driver driver = trip.getDriver();
            driver.setStatus(DriverStatus.ONLINE);
            driver.setTotalRides(driver.getTotalRides() + 1);
            driverRepository.save(driver);
        }

        Trip updatedTrip = tripRepository.save(trip);
        TripResponse payload = TripResponse.from(updatedTrip);
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", payload);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", payload);
        }
        notificationService.create(
            trip.getUser(),
            "TRIP_COMPLETED",
            "Trip completed",
            "Your trip is complete. Please finish payment when ready.",
            trip.isPaid() ? "/history" : "/payment/" + tripId,
            tripId
        );
        return updatedTrip;
    }

    @Transactional
    public Trip cancelTrip(Long tripId) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new IllegalStateException("Trip cannot be cancelled in current state");
        }

        TripStatus previousStatus = trip.getStatus();
        trip.setStatus(TripStatus.CANCELLED);
        trip.setCancelledAt(LocalDateTime.now());
        if (trip.getDriver() != null && (previousStatus == TripStatus.ACCEPTED || previousStatus == TripStatus.STARTED)) {
            Driver driver = trip.getDriver();
            driver.setStatus(DriverStatus.ONLINE);
            driverRepository.save(driver);
        }

        Trip updatedTrip = tripRepository.save(trip);
        TripResponse payload = TripResponse.from(updatedTrip);
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", payload);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", payload);
            notificationService.create(
                trip.getDriver().getUser(),
                "TRIP_CANCELLED",
                "Trip cancelled",
                "A QuickLift trip was cancelled.",
                "/driver/history",
                tripId
            );
        }
        notificationService.create(
            trip.getUser(),
            "TRIP_CANCELLED",
            "Trip cancelled",
            "Your QuickLift trip was cancelled.",
            "/history",
            tripId
        );
        return updatedTrip;
    }

    public List<Driver> findAvailableDrivers(VehicleType vehicleType) {
        return driverRepository.findByVehicleTypeAndStatus(vehicleType, DriverStatus.ONLINE);
    }

    @Transactional
    public Trip rateTrip(Long tripId, BigDecimal rating, String review) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new IllegalStateException("Can only rate completed trips");
        }
        if (trip.getRating() != null) {
            throw new IllegalStateException("Trip has already been rated");
        }
        if (rating == null || rating.compareTo(BigDecimal.ONE) < 0 || rating.compareTo(BigDecimal.valueOf(5)) > 0) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        trip.setRating(rating);
        trip.setReview(review);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip rejectTrip(Long tripId, Long driverId) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new IllegalStateException("Trip cannot be rejected in current state");
        }
        if (trip.getDriver() == null || !trip.getDriver().getId().equals(driverId)) {
            throw new org.springframework.security.access.AccessDeniedException("Trip is not assigned to this driver");
        }

        trip.setDriver(null);
        Trip savedTrip = tripRepository.save(trip);
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", Map.of(
            "id", tripId,
            "status", "REJECTED",
            "driverId", driverId
        ));
        notificationService.create(
            trip.getUser(),
            "TRIP_REJECTED",
            "Driver declined",
            "The driver declined your request. Please choose another driver.",
            "/select-driver/" + tripId,
            tripId
        );
        return savedTrip;
    }

    @Transactional
    public Trip requestExistingTripToDriver(Long tripId, Long driverId, User user) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot request a driver for this trip");
        }
        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new IllegalStateException("Trip is not available for driver requests");
        }
        if (trip.getDriver() != null && !trip.getDriver().getId().equals(driverId)) {
            throw new IllegalStateException("Trip is already requested to another driver");
        }

        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        if (driver.getStatus() != DriverStatus.ONLINE) {
            throw new IllegalStateException("Driver is not available");
        }

        trip.setDriver(driver);
        Trip savedTrip = tripRepository.save(trip);
        messagingTemplate.convertAndSend("/topic/driver/" + driverId + "/requests", TripResponse.from(savedTrip));
        notificationService.create(
            driver.getUser(),
            "RIDE_REQUEST",
            "New ride request",
            user.getUsername() + " requested a QuickLift ride.",
            "/driver/pending-requests",
            tripId
        );
        return savedTrip;
    }

    @Transactional
    public Trip createTripForDriver(TripRequest tripRequest, User user, Long driverId) {
        Trip trip = new Trip();
        trip.setUser(user);
        trip.setPickupLocation(tripRequest.getPickupLocation());
        trip.setDestination(tripRequest.getDestination());
        trip.setRequestedVehicleType(tripRequest.getVehicleType());
        trip.setPickupLatitude(tripRequest.getPickupLatitude());
        trip.setPickupLongitude(tripRequest.getPickupLongitude());
        trip.setDestinationLatitude(tripRequest.getDestinationLatitude());
        trip.setDestinationLongitude(tripRequest.getDestinationLongitude());
        trip.setNotes(tripRequest.getNotes());
        if (tripRequest.getPaymentMethod() != null) {
            trip.setPaymentMethod(normalizePaymentMethod(tripRequest.getPaymentMethod()));
        }
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(LocalDateTime.now());

        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        if (driver.getStatus() != DriverStatus.ONLINE) {
            throw new IllegalStateException("Driver is not available");
        }
        trip.setDriver(driver);
        Trip savedTrip = tripRepository.save(trip);
        messagingTemplate.convertAndSend("/topic/driver/" + driverId + "/requests", TripResponse.from(savedTrip));
        notificationService.create(
            driver.getUser(),
            "RIDE_REQUEST",
            "New ride request",
            user.getUsername() + " requested a QuickLift ride.",
            "/driver/pending-requests",
            savedTrip.getId()
        );
        return savedTrip;
    }

    @Transactional
    public Trip createTripAndAssignDriver(Trip trip) {
        List<Driver> availableDrivers = driverRepository.findByVehicleTypeAndStatus(
            trip.getRequestedVehicleType(), DriverStatus.ONLINE);
        if (availableDrivers.isEmpty()) {
            throw new RuntimeException("No drivers available");
        }
        Driver selectedDriver = availableDrivers.get(0);
        trip.setDriver(selectedDriver);
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);
        messagingTemplate.convertAndSend("/topic/driver/" + selectedDriver.getId() + "/requests", TripResponse.from(savedTrip));
        notificationService.create(
            selectedDriver.getUser(),
            "RIDE_REQUEST",
            "New ride request",
            trip.getUser().getUsername() + " requested a QuickLift ride.",
            "/driver/pending-requests",
            savedTrip.getId()
        );
        return savedTrip;
    }

    @Transactional
    public Trip payForTrip(Long tripId) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new IllegalStateException("Trip can only be paid after completion");
        }
        if (trip.isPaid()) {
            throw new IllegalStateException("Trip is already paid");
        }
        trip.setPaid(true);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updatePaymentMethod(Long tripId, String paymentMethod) {
        Trip trip = tripRepository.findByIdForUpdate(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (trip.isPaid()) {
            throw new IllegalStateException("Cannot change payment method after payment");
        }
        if (trip.getStatus() == TripStatus.CANCELLED) {
            throw new IllegalStateException("Cannot change payment method for cancelled trip");
        }
        trip.setPaymentMethod(normalizePaymentMethod(paymentMethod));
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip save(Trip trip) {
        return tripRepository.save(trip);
    }

    public String normalizePaymentMethod(String rawMethod) {
        if (rawMethod == null || rawMethod.isBlank()) {
            throw new IllegalArgumentException("Payment method is required");
        }
        String normalized = rawMethod.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_PAYMENT_METHODS.contains(normalized)) {
            throw new IllegalArgumentException("Unsupported payment method");
        }
        return normalized;
    }
}
