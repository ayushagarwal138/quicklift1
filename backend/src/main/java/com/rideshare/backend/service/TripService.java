package com.rideshare.backend.service;

import com.rideshare.backend.model.Driver;
import com.rideshare.backend.model.DriverStatus;
import com.rideshare.backend.model.Trip;
import com.rideshare.backend.model.TripStatus;
import com.rideshare.backend.model.VehicleType;
import com.rideshare.backend.repository.DriverRepository;
import com.rideshare.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

        return tripRepository.save(trip);
    }

    public Trip startTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (trip.getStatus() != TripStatus.ACCEPTED) {
            throw new RuntimeException("Trip is not accepted");
        }

        trip.setStatus(TripStatus.STARTED);
        trip.setStartedAt(LocalDateTime.now());

        return tripRepository.save(trip);
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

        return tripRepository.save(trip);
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

        return tripRepository.save(trip);
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
} 