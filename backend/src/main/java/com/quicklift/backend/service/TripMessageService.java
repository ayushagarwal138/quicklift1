package com.quicklift.backend.service;

import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripMessage;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.TripMessageRepository;
import com.quicklift.backend.repository.TripRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripMessageService {
    private final TripRepository tripRepository;
    private final TripMessageRepository tripMessageRepository;

    public TripMessageService(TripRepository tripRepository, TripMessageRepository tripMessageRepository) {
        this.tripRepository = tripRepository;
        this.tripMessageRepository = tripMessageRepository;
    }

    public List<TripMessage> findByTrip(Long tripId, User actor) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        requireTripChatAccess(trip, actor);
        return tripMessageRepository.findByTripIdOrderByCreatedAtAsc(tripId);
    }

    @Transactional
    public TripMessage create(Long tripId, String message, User actor) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        requireTripChatAccess(trip, actor);
        TripMessage tripMessage = new TripMessage();
        tripMessage.setTrip(trip);
        tripMessage.setSenderUser(actor);
        tripMessage.setMessage(message.trim());
        return tripMessageRepository.save(tripMessage);
    }

    private void requireTripChatAccess(Trip trip, User actor) {
        if (actor.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(actor.getId())) {
            return;
        }
        if (trip.getDriver() != null && trip.getDriver().getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot access chat for this trip");
    }
}
