package com.quicklift.backend.dto;

import java.time.Instant;
import java.util.Map;

public class ApiError {
    private Instant timestamp = Instant.now();
    private int status;
    private String code;
    private String message;
    private String requestId;
    private Map<String, String> details;

    public ApiError() {}

    public ApiError(int status, String code, String message, String requestId, Map<String, String> details) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.requestId = requestId;
        this.details = details;
    }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public Map<String, String> getDetails() { return details; }
    public void setDetails(Map<String, String> details) { this.details = details; }
}
