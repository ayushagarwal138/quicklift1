package com.quicklift.backend.controller;

import com.quicklift.backend.dto.LocationUpdate;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketLocationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private TripService tripService;

    @MessageMapping("/location/{tripId}")
    public void sendLocation(@DestinationVariable Long tripId, LocationUpdate locationUpdate, Principal principal) {
        Trip trip = tripService.findById(tripId).orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        if (principal == null || trip.getDriver() == null
            || !trip.getDriver().getUser().getUsername().equals(principal.getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot publish location for this trip");
        }
        // The location from a driver is broadcast to all subscribers of the trip's topic
        String topic = String.format("/topic/trip/%s/location", tripId);
        messagingTemplate.convertAndSend(topic, locationUpdate);
    }
} 
