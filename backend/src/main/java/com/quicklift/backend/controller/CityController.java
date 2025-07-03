package com.quicklift.backend.controller;

import com.quicklift.backend.model.City;
import com.quicklift.backend.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping("/search")
    public ResponseEntity<List<City>> searchCities(@RequestParam String query) {
        List<City> cities = cityService.searchCities(query);
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getAllStates() {
        List<String> states = cityService.getAllStates();
        return ResponseEntity.ok(states);
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<City>> getCitiesByState(@PathVariable String state) {
        List<City> cities = cityService.getCitiesByState(state);
        return ResponseEntity.ok(cities);
    }

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<City>> getPopularCities() {
        // Return major metro cities
        List<City> cities = cityService.searchCities("Mumbai Delhi Bangalore Chennai Hyderabad Kolkata Pune Ahmedabad");
        return ResponseEntity.ok(cities.subList(0, Math.min(10, cities.size())));
    }
} 