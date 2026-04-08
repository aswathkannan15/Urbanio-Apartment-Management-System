package com.apartmentiq.demo.apartmentiq.repository;


import com.apartmentiq.demo.apartmentiq.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;


public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    List<Visitor> findByInTimeAfterOrderByInTimeDesc(LocalDateTime after);

    long countByInTimeAfter(LocalDateTime after);
}