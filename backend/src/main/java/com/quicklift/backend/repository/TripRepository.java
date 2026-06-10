package com.quicklift.backend.repository;

import com.quicklift.backend.model.Trip;
import com.quicklift.backend.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Lock(LockModeType.OPTIMISTIC)
    @Query("select t from Trip t where t.id = :id")
    Optional<Trip> findByIdForUpdate(@Param("id") Long id);

    @Query("""
        select
            coalesce(sum(case when t.status = com.quicklift.backend.model.TripStatus.COMPLETED then t.fare else 0 end), 0),
            coalesce(avg(case when t.status = com.quicklift.backend.model.TripStatus.COMPLETED then t.rating else null end), 0),
            coalesce(sum(case when t.status in (com.quicklift.backend.model.TripStatus.ACCEPTED, com.quicklift.backend.model.TripStatus.STARTED) then 1 else 0 end), 0),
            coalesce(sum(case when t.status = com.quicklift.backend.model.TripStatus.REQUESTED then 1 else 0 end), 0),
            coalesce(sum(case when t.status in (com.quicklift.backend.model.TripStatus.COMPLETED, com.quicklift.backend.model.TripStatus.CANCELLED) then 1 else 0 end), 0)
        from Trip t
        where t.driver.id = :driverId
        """)
    Object[] getDriverSummaryAggregate(@Param("driverId") Long driverId);
    List<Trip> findByUserId(Long userId);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByUserIdAndStatus(Long userId, TripStatus status);
    List<Trip> findByDriverIdAndStatus(Long driverId, TripStatus status);
} 