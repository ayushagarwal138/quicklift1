package com.quicklift.backend.service;

import com.quicklift.backend.model.Driver;
import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.User;
import com.quicklift.backend.repository.DriverRepository;
import com.quicklift.backend.repository.TripRepository;
import com.quicklift.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public List<Driver> findAllDrivers() {
        return driverRepository.findAll();
    }

    public List<Trip> findAllTrips() {
        return tripRepository.findAll();
    }

    public void deleteDriver(Long id) {
        Driver driver = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
        // Optionally delete the associated user as well
        User user = driver.getUser();
        driverRepository.deleteById(id);
        if (user != null) {
            userRepository.deleteById(user.getId());
        }
    }
} 