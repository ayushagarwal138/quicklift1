package com.rideshare.backend.service;

import com.rideshare.backend.model.Driver;
import com.rideshare.backend.model.DriverStatus;
import com.rideshare.backend.model.Trip;
import com.rideshare.backend.model.TripStatus;
import com.rideshare.backend.model.VehicleType;
import com.rideshare.backend.repository.DriverRepository;
import com.rideshare.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Trip createTrip(Trip trip) {
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(LocalDateTime.now());
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

    public Trip acceptTrip(Long tripId, Long driverId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (trip.getStatus() != TripStatus.REQUESTED) {
            throw new RuntimeException("Trip is not available for acceptance");
        }

        if (driver.getStatus() != DriverStatus.ONLINE) {
            throw new RuntimeException("Driver is not available");
        }

        trip.setDriver(driver);
        trip.setStatus(TripStatus.ACCEPTED);
        trip.setAcceptedAt(LocalDateTime.now());
        
        driver.setStatus(DriverStatus.BUSY);
        driverRepository.save(driver);

        Trip updatedTrip = tripRepository.save(trip);
        // Broadcast trip status update
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", updatedTrip);
        // Broadcast to driver
        messagingTemplate.convertAndSend("/topic/driver/" + driverId + "/status", updatedTrip);
        return updatedTrip;
    }

    public Trip startTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new RuntimeException("Trip is not accepted");
        }

        trip.setStatus(TripStatus.STARTED);
        trip.setStartedAt(LocalDateTime.now());

        Trip updatedTrip = tripRepository.save(trip);
        // Broadcast trip status update
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", updatedTrip);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", updatedTrip);
        }
        return updatedTrip;
    }

    public Trip completeTrip(Long tripId, BigDecimal fare) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (trip.getStatus() != TripStatus.STARTED) {
            throw new RuntimeException("Trip is not started");
        }

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        trip.setFare(fare);

        // Update driver status
        if (trip.getDriver() != null) {
            Driver driver = trip.getDriver();
            driver.setStatus(DriverStatus.ONLINE);
            driver.setTotalRides(driver.getTotalRides() + 1);
            driverRepository.save(driver);
        }

        Trip updatedTrip = tripRepository.save(trip);
        // Broadcast trip status update
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", updatedTrip);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", updatedTrip);
        }
        return updatedTrip;
    }

    public Trip cancelTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed trip");
        }

        trip.setStatus(TripStatus.CANCELLED);
        trip.setCancelledAt(LocalDateTime.now());

        // Update driver status if trip was accepted
        if (trip.getDriver() != null && trip.getStatus() == TripStatus.ACCEPTED) {
            Driver driver = trip.getDriver();
            driver.setStatus(DriverStatus.ONLINE);
            driverRepository.save(driver);
        }

        Trip updatedTrip = tripRepository.save(trip);
        // Broadcast trip status update
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/status", updatedTrip);
        if (trip.getDriver() != null) {
            messagingTemplate.convertAndSend("/topic/driver/" + trip.getDriver().getId() + "/status", updatedTrip);
        }
        return updatedTrip;
    }

    public List<Driver> findAvailableDrivers(VehicleType vehicleType) {
        return driverRepository.findByVehicleTypeAndStatus(vehicleType, DriverStatus.ONLINE);
    }

    public Trip rateTrip(Long tripId, BigDecimal rating, String review) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new RuntimeException("Can only rate completed trips");
        }

        trip.setRating(rating);
        trip.setReview(review);

        return tripRepository.save(trip);
    }

    public Trip rejectTrip(Long tripId, Long driverId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        // Optionally, keep a list of rejected drivers (not implemented here)
        // For now, just log or handle as needed. You may want to add a field to Trip for rejectedDrivers.
        // This implementation does nothing except return the trip.
        // You can extend this to mark the trip as rejected by this driver, or remove from their available list.
        return trip;
    }

    public Trip createTripForDriver(com.rideshare.backend.dto.TripRequest tripRequest, com.rideshare.backend.model.User user, Long driverId) {
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
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(java.time.LocalDateTime.now());
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        trip.setDriver(driver);
        Trip savedTrip = tripRepository.save(trip);
        // Broadcast new request to driver
        messagingTemplate.convertAndSend("/topic/driver/" + driverId + "/requests", savedTrip);
        return savedTrip;
    }

    public Trip createTripAndAssignDriver(Trip trip) {
        List<Driver> availableDrivers = driverRepository.findByVehicleTypeAndStatus(
            trip.getRequestedVehicleType(), DriverStatus.ONLINE);
        if (availableDrivers.isEmpty()) {
            throw new RuntimeException("No drivers available");
        }
        Driver selectedDriver = availableDrivers.get(0); // You can randomize or optimize selection
        trip.setDriver(selectedDriver);
        trip.setStatus(TripStatus.REQUESTED);
        trip.setRequestedAt(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);
        // Notify driver of new trip request
        messagingTemplate.convertAndSend("/topic/driver/" + selectedDriver.getId() + "/requests", savedTrip);
        return savedTrip;
    }
} 