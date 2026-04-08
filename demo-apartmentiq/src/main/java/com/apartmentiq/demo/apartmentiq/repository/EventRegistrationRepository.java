package com.apartmentiq.demo.apartmentiq.repository;

import com.apartmentiq.demo.apartmentiq.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    long countByEventId(Long eventId);
    List<EventRegistration> findByUserId(Long userId);
}
