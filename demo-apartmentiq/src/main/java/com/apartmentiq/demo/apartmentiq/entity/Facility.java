package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
        import lombok.*;

// This table stores all facilities: Swimming Pool, Gym, Party Hall etc.
@Entity
@Table(name = "facilities")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Facility {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // "Swimming Pool"

    private String type;         // "POOL", "GYM", "PARTY_HALL", "TURF"

    private Integer capacity;    // max people allowed at once

    private String openTime;     // "06:00"

    private String closeTime;    // "22:00"

    private String rules;        // "No food allowed. Shower before entry."

    @Builder.Default
    private Boolean isActive = true;  // admin can disable a facility

    // In Facility.java, add:
    @Builder.Default
    private Boolean requiresBooking = true;
// true  → needs slot booking (Pool, Party Hall, Turf, Theatre)
// false → walk-in, just log entry (Gym)

}



