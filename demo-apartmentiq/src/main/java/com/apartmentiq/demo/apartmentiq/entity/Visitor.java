package com.apartmentiq.demo.apartmentiq.entity;

import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "visitors")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Visitor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String visitorName;
    private String phone;
    private String flatToVisit;
    private String vehicleNumber;
    private String photoUrl;

    // PENDING, APPROVED, REJECTED, ENTERED, EXITED
    @Builder.Default
    private String status = "PENDING";

    private LocalDateTime inTime;
    private LocalDateTime outTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User approvedBy;
}