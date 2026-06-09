package com.quicklift.backend.controller;

import com.quicklift.backend.dto.AuthRequest;
import com.quicklift.backend.dto.AuthResponse;
import com.quicklift.backend.dto.UserRegistrationRequest;
import com.quicklift.backend.dto.UserResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.model.VehicleType;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.service.AuthCookieService;
import com.quicklift.backend.service.RefreshTokenService;
import com.quicklift.backend.service.UserService;
import com.quicklift.backend.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final DriverRepository driverRepository;
    private final RefreshTokenService refreshTokenService;
    private final AuthCookieService authCookieService;

    public AuthController(
        AuthenticationManager authenticationManager,
        UserService userService,
        JwtTokenUtil jwtTokenUtil,
        DriverRepository driverRepository,
        RefreshTokenService refreshTokenService,
        AuthCookieService authCookieService
    ) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.driverRepository = driverRepository;
        this.refreshTokenService = refreshTokenService;
        this.authCookieService = authCookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userService.findByUsername(authRequest.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        return issueSession(user, response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest, HttpServletResponse response) {
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(registrationRequest.getPassword());
        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());
        user.setPhoneNumber(registrationRequest.getPhoneNumber());

        UserRole requestedRole = parseSelfRegistrationRole(registrationRequest.getRole());
        user.setRole(requestedRole);
        User registeredUser = userService.registerUser(user);

        if (requestedRole == UserRole.DRIVER) {
            createDriverProfile(registeredUser, registrationRequest);
        }

        return issueSession(registeredUser, response, HttpStatus.CREATED);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
        @CookieValue(name = "${app.auth.refresh-cookie-name:quicklift_refresh}", required = false) String refreshToken,
        HttpServletResponse response
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }
        User user = refreshTokenService.rotate(refreshToken);
        return issueSession(user, response, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        @CookieValue(name = "${app.auth.refresh-cookie-name:quicklift_refresh}", required = false) String refreshToken,
        HttpServletResponse response
    ) {
        refreshTokenService.revoke(refreshToken);
        authCookieService.clearRefreshCookie(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        User user = currentUser();
        return ResponseEntity.ok(UserResponse.from(user));
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
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        return ResponseEntity.ok(!userService.existsByUsername(username));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(!userService.existsByEmail(email));
    }

    @GetMapping("/oauth2/google/start")
    public RedirectView googleOAuthStart() {
        return new RedirectView("/oauth2/authorization/google");
    }

    @GetMapping("/oauth2/google/callback")
    public ResponseEntity<String> googleOAuthCallbackInfo() {
        return ResponseEntity.ok("Google OAuth callbacks are handled by Spring Security at /login/oauth2/code/google");
    }

    private ResponseEntity<AuthResponse> issueSession(User user, HttpServletResponse response, HttpStatus status) {
        String jwt = jwtTokenUtil.generateToken(user.getUsername(), List.of(user.getRole().name()));
        RefreshTokenService.IssuedRefreshToken refreshToken = refreshTokenService.issue(user);
        authCookieService.addRefreshCookie(response, refreshToken.value(), refreshToken.expiresAt());
        AuthResponse authResponse = new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), List.of(user.getRole().name()));
        return ResponseEntity.status(status).body(authResponse);
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserRole parseSelfRegistrationRole(String role) {
        if (role == null || role.isBlank()) {
            return UserRole.USER;
        }
        UserRole parsed = UserRole.valueOf(role.toUpperCase());
        if (parsed == UserRole.ADMIN) {
            throw new IllegalArgumentException("Admin users cannot self-register");
        }
        return parsed;
    }

    private void createDriverProfile(User registeredUser, UserRegistrationRequest registrationRequest) {
        if (isBlank(registrationRequest.getLicenseNumber()) || isBlank(registrationRequest.getVehicleType())
            || isBlank(registrationRequest.getVehicleModel()) || isBlank(registrationRequest.getVehicleColor())
            || isBlank(registrationRequest.getLicensePlate())) {
            throw new IllegalArgumentException("Driver registration requires vehicle and license details");
        }
        Driver driver = new Driver();
        driver.setUser(registeredUser);
        driver.setLicenseNumber(registrationRequest.getLicenseNumber().trim());
        driver.setVehicleType(VehicleType.valueOf(registrationRequest.getVehicleType().toUpperCase()));
        driver.setVehicleModel(registrationRequest.getVehicleModel().trim());
        driver.setVehicleColor(registrationRequest.getVehicleColor().trim());
        driver.setLicensePlate(registrationRequest.getLicensePlate().trim());
        driverRepository.save(driver);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
