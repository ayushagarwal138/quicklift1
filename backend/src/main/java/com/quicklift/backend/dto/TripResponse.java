package com.quicklift.backend.dto;

import com.quicklift.backend.model.Trip;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TripResponse {
    private Long id;
    private UserSummaryResponse user;
    private DriverResponse driver;
    private String pickupLocation;
    private String destination;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private BigDecimal destinationLatitude;
    private BigDecimal destinationLongitude;
    private String status;
    private String requestedVehicleType;
    private BigDecimal fare;
    private String notes;
    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private BigDecimal rating;
    private String review;
    private boolean paid;
    private String paymentMethod;

    public static TripResponse from(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setUser(UserSummaryResponse.from(trip.getUser()));
        response.setDriver(DriverResponse.from(trip.getDriver()));
        response.setPickupLocation(trip.getPickupLocation());
        response.setDestination(trip.getDestination());
        response.setPickupLatitude(trip.getPickupLatitude());
        response.setPickupLongitude(trip.getPickupLongitude());
        response.setDestinationLatitude(trip.getDestinationLatitude());
        response.setDestinationLongitude(trip.getDestinationLongitude());
        response.setStatus(trip.getStatus() != null ? trip.getStatus().name() : null);
        response.setRequestedVehicleType(trip.getRequestedVehicleType() != null ? trip.getRequestedVehicleType().name() : null);
        response.setFare(trip.getFare());
        response.setNotes(trip.getNotes());
        response.setRequestedAt(trip.getRequestedAt());
        response.setAcceptedAt(trip.getAcceptedAt());
        response.setStartedAt(trip.getStartedAt());
        response.setCompletedAt(trip.getCompletedAt());
        response.setCancelledAt(trip.getCancelledAt());
        response.setRating(trip.getRating());
        response.setReview(trip.getReview());
        response.setPaid(trip.isPaid());
        response.setPaymentMethod(trip.getPaymentMethod());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserSummaryResponse getUser() { return user; }
    public void setUser(UserSummaryResponse user) { this.user = user; }
    public DriverResponse getDriver() { return driver; }
    public void setDriver(DriverResponse driver) { this.driver = driver; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public BigDecimal getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(BigDecimal pickupLatitude) { this.pickupLatitude = pickupLatitude; }
    public BigDecimal getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(BigDecimal pickupLongitude) { this.pickupLongitude = pickupLongitude; }
    public BigDecimal getDestinationLatitude() { return destinationLatitude; }
    public void setDestinationLatitude(BigDecimal destinationLatitude) { this.destinationLatitude = destinationLatitude; }
    public BigDecimal getDestinationLongitude() { return destinationLongitude; }
    public void setDestinationLongitude(BigDecimal destinationLongitude) { this.destinationLongitude = destinationLongitude; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRequestedVehicleType() { return requestedVehicleType; }
    public void setRequestedVehicleType(String requestedVehicleType) { this.requestedVehicleType = requestedVehicleType; }
    public BigDecimal getFare() { return fare; }
    public void setFare(BigDecimal fare) { this.fare = fare; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
