package com.quicklift.backend.repository;

import com.quicklift.backend.model.TripMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripMessageRepository extends JpaRepository<TripMessage, Long> {
    List<TripMessage> findByTripIdOrderByCreatedAtAsc(Long tripId);
}
