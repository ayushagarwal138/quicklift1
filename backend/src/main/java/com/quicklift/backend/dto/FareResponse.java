package com.quicklift.backend.dto;

import java.math.BigDecimal;

public class FareResponse {
    private BigDecimal estimatedFare;
    private String currency = "USD"; // Or your desired currency
    private Double distance; // in kilometers

    public FareResponse(BigDecimal estimatedFare, Double distance) {
        this.estimatedFare = estimatedFare;
        this.distance = distance;
    }

    // Getters and Setters
    public BigDecimal getEstimatedFare() {
        return estimatedFare;
    }

    public void setEstimatedFare(BigDecimal estimatedFare) {
        this.estimatedFare = estimatedFare;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
} 