package com.rideshare.backend.service;

import com.rideshare.backend.model.Driver;
import com.rideshare.backend.model.Trip;
import com.rideshare.backend.model.User;
import com.rideshare.backend.repository.DriverRepository;
import com.rideshare.backend.repository.TripRepository;
import com.rideshare.backend.repository.UserRepository;
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
} 