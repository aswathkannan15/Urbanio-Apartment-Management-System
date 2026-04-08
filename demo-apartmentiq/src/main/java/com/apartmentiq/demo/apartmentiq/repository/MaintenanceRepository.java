package com.apartmentiq.demo.apartmentiq.repository;


import com.apartmentiq.demo.apartmentiq.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByResidentIdOrderByCreatedAtDesc(Long residentId);
    List<MaintenanceRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);

}

