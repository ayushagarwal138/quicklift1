package com.quicklift.backend.repository;

import com.quicklift.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByNormalizedUsername(String normalizedUsername);
    Optional<User> findByEmail(String email);
    Optional<User> findByNormalizedEmail(String normalizedEmail);
    boolean existsByUsername(String username);
    boolean existsByNormalizedUsername(String normalizedUsername);
    boolean existsByEmail(String email);
    boolean existsByNormalizedEmail(String normalizedEmail);
} 
