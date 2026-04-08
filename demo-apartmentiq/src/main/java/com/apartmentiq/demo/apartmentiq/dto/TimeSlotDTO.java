package com.apartmentiq.demo.apartmentiq.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeSlotDTO {
    private Long   id;
    private String startTime;   // "10:00"
    private String endTime;     // "11:00"
    private String status;      // "AVAILABLE" or "BOOKED"
}