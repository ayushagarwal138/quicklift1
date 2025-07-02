package com.rideshare.backend.config;

import com.rideshare.backend.model.User;
import com.rideshare.backend.model.UserRole;
import com.rideshare.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create a default admin user if one doesn't exist
        if (userService.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@rideshare.com");
            admin.setPassword("password"); // Will be encoded by the service
            admin.setRole(UserRole.ADMIN);
            
            userService.createUser(admin, UserRole.ADMIN);
            System.out.println("Created default admin user.");
        }
    }
} 