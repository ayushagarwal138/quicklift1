package com.rideshare.backend.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final RestTemplate restTemplate = new RestTemplate();

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
} 