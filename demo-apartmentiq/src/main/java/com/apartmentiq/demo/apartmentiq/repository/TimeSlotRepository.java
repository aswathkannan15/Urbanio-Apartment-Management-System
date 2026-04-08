package com.apartmentiq.demo.apartmentiq.repository;

import com.apartmentiq.demo.apartmentiq.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    // Get all slots for a specific facility on a specific date
    // Spring generates the SQL from the method name automatically
    List<TimeSlot> findByFacilityIdAndSlotDateOrderByStartTime(
            Long facilityId, LocalDate slotDate
    );

    // Check if slots already exist for a date (avoid duplicates)
    boolean existsByFacilityIdAndSlotDate(Long facilityId, LocalDate slotDate);

    // Add inside TimeSlotRepository interface:
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM TimeSlot s WHERE s.id = :id")
    Optional<TimeSlot> findByIdWithLock(Long id);
}