package com.quicklift.backend.controller;

import com.quicklift.backend.dto.DriverSummaryResponse;
import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.User;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.repository.TripRepository;
import com.quicklift.backend.service.TripService;
import com.quicklift.backend.service.UserService;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DriverControllerSummaryTest {

    @Mock
    private TripService tripService;

    @Mock
    private UserService userService;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private TripRepository tripRepository;

    private DriverController driverController;

    @BeforeEach
    void setUp() {
        driverController = new DriverController();
        ReflectionTestUtils.setField(driverController, "tripService", tripService);
        ReflectionTestUtils.setField(driverController, "userService", userService);
        ReflectionTestUtils.setField(driverController, "driverRepository", driverRepository);
        ReflectionTestUtils.setField(driverController, "tripRepository", tripRepository);

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("driver-user");
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getDriverSummaryHandlesMixedNumericAggregateTypes() {
        User user = user(1L, "driver-user");
        Driver driver = driver(7L, user);
        when(userService.findByUsername("driver-user")).thenReturn(Optional.of(user));
        when(driverRepository.findByUserId(1L)).thenReturn(Optional.of(driver));
        when(tripRepository.getDriverSummaryAggregate(7L)).thenReturn(new Object[]{
            new BigDecimal("1250.50"),
            4.25d,
            2L,
            5,
            11L,
        });

        ResponseEntity<?> response = driverController.getDriverSummary();

        assertEquals(200, response.getStatusCode().value());
        DriverSummaryResponse summary = (DriverSummaryResponse) response.getBody();
        assertNotNull(summary);
        assertEquals(0, new BigDecimal("1250.50").compareTo(summary.getEarnings()));
        assertEquals(0, new BigDecimal("4.25").compareTo(summary.getRating()));
        assertEquals(2L, summary.getActiveTrips());
        assertEquals(5L, summary.getPendingRequests());
        assertEquals(11L, summary.getHistoryTrips());
    }

    @Test
    void getDriverSummaryDefaultsToZeroWhenAggregateIsNull() {
        User user = user(1L, "driver-user");
        Driver driver = driver(7L, user);
        when(userService.findByUsername("driver-user")).thenReturn(Optional.of(user));
        when(driverRepository.findByUserId(1L)).thenReturn(Optional.of(driver));
        when(tripRepository.getDriverSummaryAggregate(7L)).thenReturn(null);

        ResponseEntity<?> response = driverController.getDriverSummary();

        assertEquals(200, response.getStatusCode().value());
        DriverSummaryResponse summary = (DriverSummaryResponse) response.getBody();
        assertNotNull(summary);
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getEarnings()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getRating()));
        assertEquals(0L, summary.getActiveTrips());
        assertEquals(0L, summary.getPendingRequests());
        assertEquals(0L, summary.getHistoryTrips());
    }

    @Test
    void getDriverSummaryFallsBackToZeroForMalformedAggregateValues() {
        User user = user(1L, "driver-user");
        Driver driver = driver(7L, user);
        when(userService.findByUsername("driver-user")).thenReturn(Optional.of(user));
        when(driverRepository.findByUserId(1L)).thenReturn(Optional.of(driver));
        when(tripRepository.getDriverSummaryAggregate(7L)).thenReturn(new Object[]{
            "999.99",
            "4.25x",
            "2",
            "invalid",
            null,
        });

        ResponseEntity<?> response = driverController.getDriverSummary();

        assertEquals(200, response.getStatusCode().value());
        DriverSummaryResponse summary = (DriverSummaryResponse) response.getBody();
        assertNotNull(summary);
        assertEquals(0, new BigDecimal("999.99").compareTo(summary.getEarnings()));
        assertEquals(0, BigDecimal.ZERO.compareTo(summary.getRating()));
        assertEquals(2L, summary.getActiveTrips());
        assertEquals(0L, summary.getPendingRequests());
        assertEquals(0L, summary.getHistoryTrips());
    }

    private static User user(Long id, String username) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        return user;
    }

    private static Driver driver(Long id, User user) {
        Driver driver = new Driver();
        driver.setId(id);
        driver.setUser(user);
        return driver;
    }
}
