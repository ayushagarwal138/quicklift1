package com.quicklift.backend.repository;

import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserId(Long userId);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByUserIdAndStatus(Long userId, TripStatus status);
    List<Trip> findByDriverIdAndStatus(Long driverId, TripStatus status);
} 