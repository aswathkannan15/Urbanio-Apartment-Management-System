package com.apartmentiq.demo.apartmentiq.dto;


import lombok.Data;

@Data
public class VisitorCheckinRequest {
    private String visitorName; private String phone;
    private String flatToVisit; private String vehicleNumber;
    private String photoBase64;
}
