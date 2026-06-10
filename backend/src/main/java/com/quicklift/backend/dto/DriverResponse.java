package com.quicklift.backend.dto;

import com.quicklift.backend.model.Driver;
import java.math.BigDecimal;

public class DriverResponse {
    private Long id;
    private UserSummaryResponse user;
    private String vehicleType;
    private String vehicleModel;
    private String vehicleColor;
    private String licensePlate;
    private String status;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private BigDecimal rating;
    private Integer totalRides;
    private boolean verified;
    private boolean available;

    public static DriverResponse from(Driver driver) {
        if (driver == null) {
            return null;
        }
        DriverResponse response = new DriverResponse();
        response.setId(driver.getId());
        response.setUser(UserSummaryResponse.from(driver.getUser()));
        response.setVehicleType(driver.getVehicleType() != null ? driver.getVehicleType().name() : null);
        response.setVehicleModel(driver.getVehicleModel());
        response.setVehicleColor(driver.getVehicleColor());
        response.setLicensePlate(driver.getLicensePlate());
        response.setStatus(driver.getStatus() != null ? driver.getStatus().name() : null);
        response.setCurrentLatitude(driver.getCurrentLatitude());
        response.setCurrentLongitude(driver.getCurrentLongitude());
        response.setRating(driver.getRating());
        response.setTotalRides(driver.getTotalRides());
        response.setVerified(driver.isVerified());
        response.setAvailable(driver.isAvailable());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserSummaryResponse getUser() { return user; }
    public void setUser(UserSummaryResponse user) { this.user = user; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public String getVehicleColor() { return vehicleColor; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }
    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
