package com.quicklift.backend.config;

import com.quicklift.backend.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class CityDataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    private CityService cityService;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            cityService.initializeCities();
        } catch (Exception e) {
            System.err.println("[CityDataInitializer] Skipping city initialization: " + e.getMessage());
        }
    }
} 