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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TripServiceNotificationTest {
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
    void acceptTripNotifiesRider() {
        User rider = user(1L, "rider", UserRole.USER);
        Driver driver = driver(2L, user(3L, "driver", UserRole.DRIVER));
        Trip trip = trip(11L, rider);
        trip.setDriver(driver);

        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));
        when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tripService.acceptTrip(11L, 2L);

        verify(notificationService).create(
            eq(rider),
            eq("TRIP_ACCEPTED"),
            eq("Ride accepted"),
            any(),
            eq("/trips/11/confirm"),
            eq(11L)
        );
        verify(messagingTemplate).convertAndSend(eq("/topic/trip/11/status"), any(Object.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/driver/2/status"), any(Object.class));
    }

    @Test
    void requestingExistingTripNotifiesDriver() {
        User rider = user(1L, "rider", UserRole.USER);
        User driverUser = user(3L, "driver", UserRole.DRIVER);
        Driver driver = driver(2L, driverUser);
        Trip trip = trip(11L, rider);

        when(tripRepository.findByIdForUpdate(11L)).thenReturn(Optional.of(trip));
        when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tripService.requestExistingTripToDriver(11L, 2L, rider);

        verify(notificationService).create(
            eq(driverUser),
            eq("RIDE_REQUEST"),
            eq("New ride request"),
            any(),
            eq("/driver/pending-requests"),
            eq(11L)
        );
        verify(messagingTemplate).convertAndSend(eq("/topic/driver/2/requests"), any(Object.class));
    }

    private static Trip trip(Long id, User user) {
        Trip trip = new Trip();
        trip.setId(id);
        trip.setUser(user);
        trip.setPickupLocation("Pickup");
        trip.setDestination("Destination");
        trip.setRequestedVehicleType(VehicleType.SEDAN);
        trip.setStatus(TripStatus.REQUESTED);
        return trip;
    }

    private static Driver driver(Long id, User user) {
        Driver driver = new Driver();
        driver.setId(id);
        driver.setUser(user);
        driver.setStatus(DriverStatus.ONLINE);
        driver.setVehicleType(VehicleType.SEDAN);
        return driver;
    }

    private static User user(Long id, String username, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setRole(role);
        return user;
    }
}
