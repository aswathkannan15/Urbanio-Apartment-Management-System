package com.apartmentiq.demo.apartmentiq.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacilityDTO {
    private Long    id;
    private String  name;
    private String  type;
    private Integer capacity;
    private String  openTime;
    private String  closeTime;
    private String  rules;
}