package com.apartmentiq.demo.apartmentiq.repository;


import com.apartmentiq.demo.apartmentiq.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsActiveTrueOrderByEventDateAsc();
}