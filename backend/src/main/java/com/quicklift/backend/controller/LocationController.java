package com.quicklift.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @GetMapping("/health")
    public String health() {
        return "LocationController is working!";
    }

    @GetMapping("/reverse")
    public String reverse(@RequestParam("lat") String lat, @RequestParam("lon") String lon) {
        return "Reverse geocoding: " + lat + ", " + lon;
    }
} 