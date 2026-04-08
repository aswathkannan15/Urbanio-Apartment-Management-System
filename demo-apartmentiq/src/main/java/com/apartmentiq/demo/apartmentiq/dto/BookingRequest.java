package com.apartmentiq.demo.apartmentiq.dto;

import jakarta.validation.constraints.*;
        import lombok.Data;

@Data
public class BookingRequest {
    @NotNull  private Long    slotId;
    @NotNull  private Long    facilityId;
    @Min(1)   private Integer memberCount;
    @NotBlank private String  purpose;
}