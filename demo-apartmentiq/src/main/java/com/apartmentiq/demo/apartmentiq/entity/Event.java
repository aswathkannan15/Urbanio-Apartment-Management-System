package com.apartmentiq.demo.apartmentiq.entity;


import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDateTime;

@Entity @Table(name="events")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private Integer maxCapacity;
    private String venue;         // e.g. "Open Theatre", "Party Hall"
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="created_by")
    private User createdBy;
}