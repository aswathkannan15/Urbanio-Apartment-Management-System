package com.apartmentiq.demo.apartmentiq.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    private String        title;
    private String        description;
    private LocalDateTime eventDate;
    private Integer       maxCapacity;
    private String        venue;
}