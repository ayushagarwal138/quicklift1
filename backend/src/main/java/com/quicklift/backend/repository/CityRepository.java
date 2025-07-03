package com.quicklift.backend.repository;

import com.quicklift.backend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    List<City> findByNameContainingIgnoreCase(String name);
    
    List<City> findByStateContainingIgnoreCase(String state);
    
    List<City> findByStateCode(String stateCode);
    
    @Query("SELECT c FROM City c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.state) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<City> searchCities(@Param("query") String query);
    
    @Query("SELECT DISTINCT c.state FROM City c ORDER BY c.state")
    List<String> findAllStates();
    
    @Query("SELECT c FROM City c WHERE c.state = :state ORDER BY c.name")
    List<City> findByState(@Param("state") String state);
} 