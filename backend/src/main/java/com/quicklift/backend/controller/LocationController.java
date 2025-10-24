package com.quicklift.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private static final Logger logger = LoggerFactory.getLogger(LocationController.class);

    @Autowired
    private RestTemplate restTemplate;

    public LocationController() {
        logger.info("LocationController initialized successfully");
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "LocationController is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(@RequestParam("lat") String lat, @RequestParam("lon") String lon) {
        logger.info("Reverse geocoding request - lat: {}, lon: {}", lat, lon);
        
        try {
            // Validate parameters
            double latDouble = Double.parseDouble(lat);
            double lonDouble = Double.parseDouble(lon);
            
            // Validate coordinate ranges
            if (latDouble < -90 || latDouble > 90) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid latitude. Must be between -90 and 90."));
            }
            if (lonDouble < -180 || lonDouble > 180) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid longitude. Must be between -180 and 180."));
            }
            
            // Call Nominatim API
            String url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + latDouble + "&lon=" + lonDouble;
            logger.info("Calling Nominatim API: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "QuickLift-App/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            logger.info("Nominatim API response status: {}", response.getStatusCode());
            
            if (response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.ok(createErrorResponse("No location data found"));
            }
            
        } catch (NumberFormatException e) {
            logger.error("Invalid latitude or longitude parameters: lat={}, lon={}", lat, lon);
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid latitude or longitude parameters"));
        } catch (Exception e) {
            logger.error("Error while fetching from Nominatim: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error while fetching location data: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchLocation(@RequestParam("q") String query) {
        logger.info("Location search request - query: {}", query);
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("Search query cannot be empty"));
        }
        
        try {
            // Call Nominatim search API
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + 
                        java.net.URLEncoder.encode(query, "UTF-8") + "&limit=10";
            logger.info("Calling Nominatim search API: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "QuickLift-App/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Object[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object[].class);
            logger.info("Nominatim search API response status: {}", response.getStatusCode());
            
            if (response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.ok(new Object[0]);
            }
            
        } catch (Exception e) {
            logger.error("Error while searching locations: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error while searching locations: " + e.getMessage()));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return errorResponse;
    }
} 