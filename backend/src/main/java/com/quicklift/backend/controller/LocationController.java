package com.quicklift.backend.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Logger logger = LoggerFactory.getLogger(LocationController.class);
    
    public LocationController() {
        logger.info("LocationController initialized successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchLocations(@RequestParam("q") String query) {
        String url = "https://nominatim.openstreetmap.org/search?q=" + query + "&format=json&limit=5&countrycodes=in";
        
        HttpHeaders headers = new HttpHeaders();
        // Nominatim API requires a User-Agent header
        headers.set("User-Agent", "Rideshare-App/1.0"); 

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response;
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error while fetching from Nominatim: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("Health check endpoint called");
        return ResponseEntity.ok("LocationController is working!");
    }

    @GetMapping("/reverse")
    public ResponseEntity<String> reverseGeocode(@RequestParam("lat") String lat, @RequestParam("lon") String lon) {
        logger.info("Reverse geocoding request - lat: {}, lon: {}", lat, lon);
        
        try {
            // Validate that the parameters are valid numbers
            double latDouble = Double.parseDouble(lat);
            double lonDouble = Double.parseDouble(lon);
            
            String url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + latDouble + "&lon=" + lonDouble;
            logger.info("Calling Nominatim API: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            // Nominatim API requires a User-Agent header
            headers.set("User-Agent", "Rideshare-App/1.0"); 

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            logger.info("Nominatim API response status: {}", response.getStatusCode());
            return response;
        } catch (NumberFormatException e) {
            logger.error("Invalid latitude or longitude parameters: lat={}, lon={}", lat, lon);
            return ResponseEntity.status(400).body("Invalid latitude or longitude parameters");
        } catch (Exception e) {
            logger.error("Error while fetching from Nominatim: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error while fetching from Nominatim: " + e.getMessage());
        }
    }

} 