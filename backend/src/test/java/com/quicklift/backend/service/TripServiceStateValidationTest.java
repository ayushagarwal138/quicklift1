package com.quicklift.backend.service;

import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.DriverStatus;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.model.VehicleType;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.repository.TripRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TripServiceStateValidationTest {
    @Mock
    private TripRepository tripRepository;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private NotificationService notificationService;

    private TripService tripService;

    @BeforeEach
    void setUp() {
        tripService = new TripService();
        ReflectionTestUtils.setField(tripService, "tripRepository", tripRepository);
        ReflectionTestUtils.setField(tripService, "driverRepository", driverRepository);
        ReflectionTestUtils.setField(tripService, "messagingTemplate", messagingTemplate);
        ReflectionTestUtils.setField(tripService, "notificationService", notificationService);
    }

    @Test
    void acceptTripFailsWhenTripAlreadyAccepted() {
        Driver driver = driver(2L, DriverStatus.ONLINE);
        Trip trip = trip(11L, TripStatus.ACCEPTED, user(1L, UserRole.USER));
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));
        when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));

        assertThrows(IllegalStateException.class, () -> tripService.acceptTrip(11L, 2L));
    }

    @Test
    void rejectTripFailsWhenTripAlreadyAcceptedByAnotherDriver() {
        Driver assignedDriver = driver(3L, DriverStatus.ONLINE);
        Trip trip = trip(11L, TripStatus.ACCEPTED, user(1L, UserRole.USER));
        trip.setDriver(assignedDriver);
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));

        assertThrows(IllegalStateException.class, () -> tripService.rejectTrip(11L, 2L));
    }

    @Test
    void rejectTripFailsWhenTripNotAssignedToRequester() {
        Driver assignedDriver = driver(3L, DriverStatus.ONLINE);
        Trip trip = trip(11L, TripStatus.REQUESTED, user(1L, UserRole.USER));
        trip.setDriver(assignedDriver);
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));

        assertThrows(AccessDeniedException.class, () -> tripService.rejectTrip(11L, 2L));
    }

    @Test
    void completeTripRequiresPositiveFinalFare() {
        Trip trip = trip(11L, TripStatus.STARTED, user(1L, UserRole.USER));
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));

        assertThrows(IllegalArgumentException.class, () -> tripService.completeTrip(11L, BigDecimal.ZERO));
    }

    @Test
    void payForTripRequiresCompletedStateAndNonPaidTrip() {
        Trip started = trip(11L, TripStatus.STARTED, user(1L, UserRole.USER));
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(started));
        assertThrows(IllegalStateException.class, () -> tripService.payForTrip(11L));

        Trip completed = trip(12L, TripStatus.COMPLETED, user(1L, UserRole.USER));
        completed.setPaid(true);
        when(tripRepository.findByIdForUpdate(12L)).thenReturn(Optional.of(completed));
        assertThrows(IllegalStateException.class, () -> tripService.payForTrip(12L));
    }

    @Test
    void rateTripFailsWhenAlreadyRated() {
        Trip completed = trip(11L, TripStatus.COMPLETED, user(1L, UserRole.USER));
        completed.setRating(BigDecimal.valueOf(4.5));
        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(completed));

        assertThrows(IllegalStateException.class, () -> tripService.rateTrip(11L, BigDecimal.valueOf(5), "Great"));
    }

    @Test
    void createTripForDriverRequiresOnlineDriver() {
        Driver offlineDriver = driver(2L, DriverStatus.OFFLINE);
        when(driverRepository.findById(2L)).thenReturn(Optional.of(offlineDriver));

        assertThrows(IllegalStateException.class, () -> tripService.createTripForDriver(new com.quicklift.backend.dto.TripRequest(), user(1L, UserRole.USER), 2L));
    }

    private static Trip trip(Long id, TripStatus status, User user) {
        Trip trip = new Trip();
        trip.setId(id);
        trip.setUser(user);
        trip.setPickupLocation("Pickup");
        trip.setDestination("Destination");
        trip.setRequestedVehicleType(VehicleType.SEDAN);
        trip.setStatus(status);
        return trip;
    }

    private static Driver driver(Long id, DriverStatus status) {
        Driver driver = new Driver();
        driver.setId(id);
        driver.setUser(user(id + 100, UserRole.DRIVER));
        driver.setStatus(status);
        driver.setVehicleType(VehicleType.SEDAN);
        return driver;
    }

    private static User user(Long id, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setUsername("user" + id);
        user.setRole(role);
        return user;
    }
}
