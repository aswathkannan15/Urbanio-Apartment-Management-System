package com.apartmentiq.demo.apartmentiq.controller;


import com.apartmentiq.demo.apartmentiq.dto.FacilityDTO;
import com.apartmentiq.demo.apartmentiq.dto.TimeSlotDTO;
import com.apartmentiq.demo.apartmentiq.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
        import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    // GET /api/facilities
    // Returns all active facilities — React shows these as cards
    @GetMapping
    public ResponseEntity<List<FacilityDTO>> getAll() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    // GET /api/facilities/1/slots?date=2025-01-15
    // Returns all hourly slots for that facility + date
    @GetMapping("/{id}/slots")
    public ResponseEntity<List<TimeSlotDTO>> getSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(facilityService.getSlots(id, date));
    }
}