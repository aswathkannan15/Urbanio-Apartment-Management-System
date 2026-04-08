package com.apartmentiq.demo.apartmentiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitorDTO {
    private Long id;
    private String visitorName;
    private String phone;
    private String flatToVisit;
    private String vehicleNumber;
    private String photoUrl;
    private String inTime;
    private String outTime;
    private String status; // PENDING, APPROVED, REJECTED, ENTERED, EXITED
}