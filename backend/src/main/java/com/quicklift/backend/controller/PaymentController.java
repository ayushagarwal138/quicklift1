package com.quicklift.backend.controller;

import com.quicklift.backend.dto.PaymentRequest;
import com.quicklift.backend.dto.PaymentResponse;
import com.quicklift.backend.model.User;
import com.quicklift.backend.service.PaymentService;
import com.quicklift.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/payments", "/api/payments"})
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PaymentResponse.from(paymentService.createSimulatedPayment(request, currentUser())));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(PaymentResponse.from(paymentService.findById(paymentId, currentUser())));
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getPaymentsByTrip(@RequestParam Long tripId) {
        return ResponseEntity.ok(paymentService.findByTrip(tripId, currentUser()).stream()
            .map(PaymentResponse::from)
            .toList());
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
