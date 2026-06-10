package com.quicklift.backend.controller;

import com.quicklift.backend.dto.TripChatMessageRequest;
import com.quicklift.backend.dto.TripMessageResponse;
import com.quicklift.backend.model.User;
import com.quicklift.backend.service.TripMessageService;
import com.quicklift.backend.service.UserService;
import java.security.Principal;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class TripChatWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final TripMessageService tripMessageService;
    private final UserService userService;

    public TripChatWebSocketController(
        SimpMessagingTemplate messagingTemplate,
        TripMessageService tripMessageService,
        UserService userService
    ) {
        this.messagingTemplate = messagingTemplate;
        this.tripMessageService = tripMessageService;
        this.userService = userService;
    }

    @MessageMapping("/chat/{tripId}")
    public void sendChat(
        @DestinationVariable Long tripId,
        TripChatMessageRequest request,
        Principal principal
    ) {
        if (principal == null) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthenticated chat sender");
        }
        User sender = userService.findByUsername(principal.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var persistedMessage = tripMessageService.create(tripId, request.getMessage(), sender);
        messagingTemplate.convertAndSend(
            "/topic/trip/" + tripId + "/chat",
            TripMessageResponse.from(persistedMessage)
        );
    }
}
