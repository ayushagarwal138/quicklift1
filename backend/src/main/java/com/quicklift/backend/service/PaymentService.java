package com.quicklift.backend.service;

import com.quicklift.backend.dto.PaymentRequest;
import com.quicklift.backend.model.Payment;
import com.quicklift.backend.model.PaymentStatus;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.PaymentRepository;
import com.quicklift.backend.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final TripRepository tripRepository;

    public PaymentService(PaymentRepository paymentRepository, TripRepository tripRepository) {
        this.paymentRepository = paymentRepository;
        this.tripRepository = tripRepository;
    }

    @Transactional
    public Payment createSimulatedPayment(PaymentRequest request, User actor) {
        if (request.getIdempotencyKey() != null && !request.getIdempotencyKey().isBlank()) {
            var existing = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                requirePaymentAccess(existing.get(), actor);
                return existing.get();
            }
        }

        Trip trip = tripRepository.findById(request.getTripId())
            .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        requireTripPaymentAccess(trip, actor);
        if (trip.getFare() == null) {
            throw new IllegalStateException("Trip fare is required before payment");
        }

        Payment payment = new Payment();
        payment.setTrip(trip);
        payment.setAmount(trip.getFare());
        payment.setMethod(request.getMethod().trim().toUpperCase());
        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setProvider("SIMULATED");
        payment.setProviderReference("SIM-" + trip.getId() + "-" + System.currentTimeMillis());
        payment.setIdempotencyKey(request.getIdempotencyKey());
        Payment savedPayment = paymentRepository.save(payment);

        trip.setPaymentMethod(payment.getMethod());
        trip.setPaid(true);
        tripRepository.save(trip);
        return savedPayment;
    }

    public Payment findById(Long paymentId, User actor) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        requirePaymentAccess(payment, actor);
        return payment;
    }

    public List<Payment> findByTrip(Long tripId, User actor) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        requireTripViewAccess(trip, actor);
        return paymentRepository.findByTripId(tripId);
    }

    private void requirePaymentAccess(Payment payment, User actor) {
        requireTripViewAccess(payment.getTrip(), actor);
    }

    private void requireTripPaymentAccess(Trip trip, User actor) {
        if (actor.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot pay for this trip");
    }

    private void requireTripViewAccess(Trip trip, User actor) {
        if (actor.getRole() == UserRole.ADMIN || trip.getUser().getId().equals(actor.getId())) {
            return;
        }
        if (trip.getDriver() != null && trip.getDriver().getUser().getId().equals(actor.getId())) {
            return;
        }
        throw new org.springframework.security.access.AccessDeniedException("Cannot access this payment");
    }
}
