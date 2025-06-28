package com.rideshare.backend.controller;

import com.rideshare.backend.dto.AuthRequest;
import com.rideshare.backend.dto.AuthResponse;
import com.rideshare.backend.dto.UserRegistrationRequest;
import com.rideshare.backend.model.User;
import com.rideshare.backend.service.UserService;
import com.rideshare.backend.util.JwtTokenUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenUtil.generateToken(authRequest.getUsername());

        User user = userService.findByUsername(authRequest.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        AuthResponse response = new AuthResponse(jwt, user.getId(), user.getUsername(), 
                                               user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        try {
            User user = new User();
            user.setUsername(registrationRequest.getUsername());
            user.setEmail(registrationRequest.getEmail());
            user.setPassword(registrationRequest.getPassword());
            user.setFirstName(registrationRequest.getFirstName());
            user.setLastName(registrationRequest.getLastName());
            user.setPhoneNumber(registrationRequest.getPhoneNumber());

            User registeredUser = userService.registerUser(user);

            // Generate JWT token for the newly registered user
            String jwt = jwtTokenUtil.generateToken(registeredUser.getUsername());
            AuthResponse response = new AuthResponse(jwt, registeredUser.getId(), 
                                                   registeredUser.getUsername(), 
                                                   registeredUser.getEmail(), 
                                                   registeredUser.getRole().name());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (jwtTokenUtil.validateToken(jwt)) {
                return ResponseEntity.ok().body("Token is valid");
            }
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }
} 