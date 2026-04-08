package com.apartmentiq.demo.apartmentiq.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    private String message;
    private String type;       // BOOKING, EVENT, MAINTENANCE, ANNOUNCEMENT, VISITOR_REQUEST
    
    private Long targetId;     // ID of the related object (e.g., visitor ID)
    private String actionStatus; // PENDING, COMPLETED, CANCELLED

    @Builder.Default
    private Boolean isRead = false;
    private LocalDateTime createdAt;
}