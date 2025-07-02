package com.rideshare.backend.service;

import com.rideshare.backend.dto.TripRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FareService {

    private static final double EARTH_RADIUS_KM = 6371;
    
    // Per-kilometer rate in rupees
    private static final BigDecimal RATE_PER_KM = new BigDecimal("11.00");

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public BigDecimal calculateFare(TripRequest request) {
        if (request.getPickupLatitude() == null || request.getPickupLongitude() == null ||
            request.getDestinationLatitude() == null || request.getDestinationLongitude() == null) {
            // Cannot calculate fare without coordinates, return a default or throw exception
            // For now, let's return a default value or handle as an error.
            // Returning zero or a default could be misleading. Let's throw an exception.
            throw new IllegalArgumentException("Pickup/destination coordinates are required to estimate fare.");
        }

        double distance = calculateDistance(
            request.getPickupLatitude().doubleValue(),
            request.getPickupLongitude().doubleValue(),
            request.getDestinationLatitude().doubleValue(),
            request.getDestinationLongitude().doubleValue()
        );

        BigDecimal tolls = request.getTolls() != null ? request.getTolls() : BigDecimal.ZERO;
        return calculateFare(distance, tolls);
    }

    public BigDecimal calculateFare(double distance, BigDecimal tolls) {
        BigDecimal distanceCost = BigDecimal.valueOf(distance).multiply(RATE_PER_KM);
        return distanceCost.add(tolls).setScale(2, RoundingMode.HALF_UP);
    }
} 