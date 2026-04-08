package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDate;
import java.time.LocalTime;

// Each row = one bookable hour for one facility on one date
// Example: Swimming Pool, 2025-01-15, 10:00-11:00, AVAILABLE
@Entity
@Table(name = "time_slots")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TimeSlot {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which facility this slot belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id")
    private Facility facility;

    private LocalDate slotDate;   // 2025-01-15

    private LocalTime startTime;  // 10:00

    private LocalTime endTime;    // 11:00

    @Enumerated(EnumType.STRING)
    private SlotStatus status;    // AVAILABLE or BOOKED

    // @Version enables optimistic locking — Day 3 conflict prevention
    @Version
    private Long version;
}