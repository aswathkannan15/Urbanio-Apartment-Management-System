package com.apartmentiq.demo.apartmentiq.controller;


import com.apartmentiq.demo.apartmentiq.entity.Facility;
import com.apartmentiq.demo.apartmentiq.entity.GymEntry;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.FacilityRepository;
import com.apartmentiq.demo.apartmentiq.repository.GymEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/gym")
@RequiredArgsConstructor
public class GymEntryController {

    private final GymEntryRepository gymEntryRepo;
    private final FacilityRepository facilityRepo;

    // Resident taps "Enter Gym" — logs entry
    @PostMapping("/enter/{facilityId}")
    public ResponseEntity<?> enter(@PathVariable Long facilityId,
                                   @AuthenticationPrincipal User user) {
        Facility facility = facilityRepo.findById(facilityId).orElseThrow();
        GymEntry entry = GymEntry.builder()
                .resident(user).facility(facility)
                .entryTime(LocalDateTime.now()).build();
        gymEntryRepo.save(entry);
        return ResponseEntity.ok(Map.of(
                "message", "Entry logged. Enjoy your workout!",
                "entryId", entry.getId()
        ));
    }

    // Resident taps "Exit Gym" — logs exit
    @PutMapping("/exit/{entryId}")
    public ResponseEntity<?> exit(@PathVariable Long entryId) {
        GymEntry entry = gymEntryRepo.findById(entryId).orElseThrow();
        entry.setExitTime(LocalDateTime.now());
        gymEntryRepo.save(entry);
        return ResponseEntity.ok(Map.of("message","Exit logged. Great workout!"));
    }

    // Current occupancy — how many people are in the gym right now
    @GetMapping("/occupancy/{facilityId}")
    public ResponseEntity<?> occupancy(@PathVariable Long facilityId) {
        long count = gymEntryRepo.countByFacilityIdAndExitTimeIsNull(facilityId);
        return ResponseEntity.ok(Map.of("current", count));
    }

    // Current entry status for a user — helps UI recover state without localStorage
    @GetMapping("/status/{facilityId}")
    public ResponseEntity<?> status(@PathVariable Long facilityId, @AuthenticationPrincipal User user) {
        var entry = gymEntryRepo.findFirstByFacilityIdAndResidentIdAndExitTimeIsNull(facilityId, user.getId());
        if (entry.isPresent()) {
            return ResponseEntity.ok(Map.of("isInside", true, "entryId", entry.get().getId()));
        }
        return ResponseEntity.ok(Map.of("isInside", false));
    }
}