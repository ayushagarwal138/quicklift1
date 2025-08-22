package com.quicklift.backend.dto;

import java.math.BigDecimal;

public class DriverSummaryResponse {
    private BigDecimal earnings;
    private BigDecimal rating;
    private long activeTrips;
    private long pendingRequests;
    private long historyTrips;

    public DriverSummaryResponse(BigDecimal earnings, BigDecimal rating, long activeTrips, long pendingRequests, long historyTrips) {
        this.earnings = earnings;
        this.rating = rating;
        this.activeTrips = activeTrips;
        this.pendingRequests = pendingRequests;
        this.historyTrips = historyTrips;
    }

    public BigDecimal getEarnings() { return earnings; }
    public BigDecimal getRating() { return rating; }
    public long getActiveTrips() { return activeTrips; }
    public long getPendingRequests() { return pendingRequests; }
    public long getHistoryTrips() { return historyTrips; }
}
