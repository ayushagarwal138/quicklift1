package com.quicklift.backend.dto;

import java.math.BigDecimal;

public class LocationUpdate {
    private BigDecimal latitude;
    private BigDecimal longitude;

    public LocationUpdate() {}

    public LocationUpdate(BigDecimal latitude, BigDecimal longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and Setters
    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
} 