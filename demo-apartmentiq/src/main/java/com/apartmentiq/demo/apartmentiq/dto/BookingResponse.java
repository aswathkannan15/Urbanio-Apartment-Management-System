package com.apartmentiq.demo.apartmentiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingResponse {
    private Long   id;
    private String facilityName;
    private String slotDate;
    private String startTime;
    private String endTime;
    private String status;
    private String purpose;
    private Integer memberCount;
    private String bookedAt;
}