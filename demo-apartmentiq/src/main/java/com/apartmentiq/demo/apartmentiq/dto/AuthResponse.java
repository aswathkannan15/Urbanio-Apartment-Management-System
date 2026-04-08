package com.apartmentiq.demo.apartmentiq.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;   // JWT → localStorage
    private String role;    // RESIDENT / ADMIN / SECURITY
    private String name;
    private Long   userId;
    private String email;
    private String flatNo;
}