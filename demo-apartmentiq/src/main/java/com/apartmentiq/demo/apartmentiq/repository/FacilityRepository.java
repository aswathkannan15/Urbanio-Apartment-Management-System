package com.apartmentiq.demo.apartmentiq.repository;

import com.apartmentiq.demo.apartmentiq.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {

    // Spring generates: SELECT * FROM facilities WHERE is_active = true
    List<Facility> findByIsActiveTrue();
}