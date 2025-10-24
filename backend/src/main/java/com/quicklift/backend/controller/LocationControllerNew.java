package com.quicklift.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations-new")
public class LocationControllerNew {

    @GetMapping("/health")
    public String health() {
        return "New LocationController is working!";
    }

    @GetMapping("/reverse")
    public String reverse(@org.springframework.web.bind.annotation.RequestParam("lat") String lat, 
                         @org.springframework.web.bind.annotation.RequestParam("lon") String lon) {
        return "Reverse geocoding: " + lat + ", " + lon;
    }
}
