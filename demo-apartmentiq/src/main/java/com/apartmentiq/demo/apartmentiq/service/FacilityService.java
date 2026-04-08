package com.apartmentiq.demo.apartmentiq.service;


import com.apartmentiq.demo.apartmentiq.dto.FacilityDTO;
import com.apartmentiq.demo.apartmentiq.dto.TimeSlotDTO;
import com.apartmentiq.demo.apartmentiq.entity.*;
        import com.apartmentiq.demo.apartmentiq.repository.*;
        import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepo;
    private final TimeSlotRepository timeSlotRepo;

    // ── Get all active facilities ─────────────────────────
    public List<FacilityDTO> getAllFacilities() {
        return facilityRepo.findByIsActiveTrue()
                .stream()
                .map(this::toDTO)        // convert each Facility entity → FacilityDTO
                .collect(Collectors.toList());
    }

    // ── Get slots for a facility on a date ────────────────
    public List<TimeSlotDTO> getSlots(Long facilityId, LocalDate date) {
        // Auto-generate slots if they don't exist for this date yet
        if (!timeSlotRepo.existsByFacilityIdAndSlotDate(facilityId, date)) {
            generateSlotsForDate(facilityId, date);
        }
        return timeSlotRepo
                .findByFacilityIdAndSlotDateOrderByStartTime(facilityId, date)
                .stream()
                .map(this::toSlotDTO)
                .collect(Collectors.toList());
    }

    // ── Auto-generate hourly slots for a facility/date ────
    // Example: Swimming Pool, 06:00 - 22:00 → creates 16 slot rows
    private void generateSlotsForDate(Long facilityId, LocalDate date) {
        Facility facility = facilityRepo.findById(facilityId)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        // Parse openTime and closeTime strings like "06:00"
        LocalTime open  = LocalTime.parse(facility.getOpenTime());
        LocalTime close = LocalTime.parse(facility.getCloseTime());

        // Create one slot per hour between open and close
        LocalTime current = open;
        while (current.isBefore(close)) {
            TimeSlot slot = TimeSlot.builder()
                    .facility(facility)
                    .slotDate(date)
                    .startTime(current)
                    .endTime(current.plusHours(1))
                    .status(SlotStatus.AVAILABLE)
                    .build();
            timeSlotRepo.save(slot);
            current = current.plusHours(1);
        }
    }

    // ── Entity → DTO converters ───────────────────────────
    private FacilityDTO toDTO(Facility f) {
        return FacilityDTO.builder()
                .id(f.getId()).name(f.getName()).type(f.getType())
                .capacity(f.getCapacity()).openTime(f.getOpenTime())
                .closeTime(f.getCloseTime()).rules(f.getRules())
                .build();
    }

    private TimeSlotDTO toSlotDTO(TimeSlot s) {
        return TimeSlotDTO.builder()
                .id(s.getId())
                .startTime(s.getStartTime().toString())
                .endTime(s.getEndTime().toString())
                .status(s.getStatus().name())
                .build();
    }
}