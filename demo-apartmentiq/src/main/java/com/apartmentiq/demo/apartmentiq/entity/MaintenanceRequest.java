package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="resident_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User resident;

    private String category;   // PLUMBING, ELECTRICAL, CLEANING, OTHER
    private String title;
    private String description;
    private String status;     // OPEN, IN_PROGRESS, RESOLVED

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}