package com.apartmentiq.demo.apartmentiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long   id;
    private String title;
    private String description;
    private String eventDate;    // ISO string from LocalDateTime.toString()
    private Integer maxCapacity;
    private String venue;
}