package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// One row = one resident booked one slot
@Entity
@Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which resident made this booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private User resident;

    // Which facility
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id")
    private Facility facility;

    // Which specific time slot
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id")
    private TimeSlot slot;

    private Integer memberCount;   // how many people coming

    private String purpose;        // "Birthday party" / "Workout session"

    @Enumerated(EnumType.STRING)
    private BookingStatus status;  // CONFIRMED or CANCELLED

    private LocalDateTime bookedAt;
}