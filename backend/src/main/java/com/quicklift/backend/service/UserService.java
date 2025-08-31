package com.quicklift.backend.service;

import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;
import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user, UserRole role) {
        String normalizedUsername = normalize(user.getUsername());
        String normalizedEmail = normalize(user.getEmail());
        if (userRepository.existsByNormalizedUsername(normalizedUsername)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByNormalizedEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }
        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        UserRole role = user.getRole();
        if (role == null) {
            role = UserRole.USER;
        }
        return createUser(user, role);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByNormalizedUsername(normalize(username));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByNormalizedEmail(normalize(email));
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByNormalizedUsername(normalize(username));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByNormalizedEmail(normalize(email));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
} 
