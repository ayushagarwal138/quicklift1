package com.rideshare.backend.controller;

import com.rideshare.backend.dto.AuthRequest;
import com.rideshare.backend.dto.AuthResponse;
import com.rideshare.backend.dto.UserRegistrationRequest;
import com.rideshare.backend.model.Driver;
import com.rideshare.backend.model.User;
import com.rideshare.backend.model.VehicleType;
import com.rideshare.backend.repository.DriverRepository;
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

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private DriverRepository driverRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userService.findByUsername(authRequest.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        String jwt = jwtTokenUtil.generateToken(user.getUsername(), List.of(user.getRole().name()));

        AuthResponse response = new AuthResponse(jwt, user.getId(), user.getUsername(), 
                                               user.getEmail(), List.of(user.getRole().name()));
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
            // Set role if provided and valid
            String roleStr = registrationRequest.getRole();
            if (roleStr != null) {
                try {
                    user.setRole(com.rideshare.backend.model.UserRole.valueOf(roleStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    user.setRole(com.rideshare.backend.model.UserRole.USER);
                }
            } else {
                user.setRole(com.rideshare.backend.model.UserRole.USER);
            }
            User registeredUser = userService.registerUser(user);

            // If registering as DRIVER, create Driver entity
            if (registeredUser.getRole() == com.rideshare.backend.model.UserRole.DRIVER) {
                Driver driver = new Driver();
                driver.setUser(registeredUser);
                driver.setLicenseNumber(registrationRequest.getLicenseNumber());
                driver.setVehicleType(VehicleType.valueOf(registrationRequest.getVehicleType()));
                driver.setVehicleModel(registrationRequest.getVehicleModel());
                driver.setVehicleColor(registrationRequest.getVehicleColor());
                driver.setLicensePlate(registrationRequest.getLicensePlate());
                driverRepository.save(driver);
            }

            // Generate JWT token for the newly registered user
            String jwt = jwtTokenUtil.generateToken(registeredUser.getUsername(), List.of(registeredUser.getRole().name()));
            AuthResponse response = new AuthResponse(jwt, registeredUser.getId(), 
                                                   registeredUser.getUsername(), 
                                                   registeredUser.getEmail(), 
                                                   List.of(registeredUser.getRole().name()));
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

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(!exists);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(!exists);
    }
} 