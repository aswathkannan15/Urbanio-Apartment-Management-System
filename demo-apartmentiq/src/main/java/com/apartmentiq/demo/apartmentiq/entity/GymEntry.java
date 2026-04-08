package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="gym_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymEntry {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="resident_id")
    private User resident;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="facility_id")
    private Facility facility;
}
