package com.rideshare.backend.controller;

import com.rideshare.backend.dto.LocationUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketLocationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/location/{tripId}")
    public void sendLocation(@DestinationVariable String tripId, LocationUpdate locationUpdate) {
        // The location from a driver is broadcast to all subscribers of the trip's topic
        String topic = String.format("/topic/trip/%s/location", tripId);
        messagingTemplate.convertAndSend(topic, locationUpdate);
    }
} 