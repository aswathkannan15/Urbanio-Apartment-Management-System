package com.apartmentiq.demo.apartmentiq.dto;

import com.apartmentiq.demo.apartmentiq.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    @Email
    private String email;
    @Size(min=6) private String password;
    private Role role;
    private String flatNo;
    private String phone;
}