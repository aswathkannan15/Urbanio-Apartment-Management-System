package com.apartmentiq.demo.apartmentiq.controller;


import com.apartmentiq.demo.apartmentiq.entity.MaintenanceRequest;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceRepository maintenanceRepo;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MaintenanceRequest req,
                                    @AuthenticationPrincipal User user) {
        req.setResident(user);
        req.setStatus("OPEN");
        req.setCreatedAt(LocalDateTime.now());
        maintenanceRepo.save(req);
        return ResponseEntity.ok(Map.of("message","Request submitted"));
    }

    @GetMapping("/my")
    public ResponseEntity<?> myRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(maintenanceRepo
                .findByResidentIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(maintenanceRepo.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String,String> body) {
        MaintenanceRequest req = maintenanceRepo.findById(id).orElseThrow();
        req.setStatus(body.get("status"));
        if ("RESOLVED".equals(body.get("status")))
            req.setResolvedAt(LocalDateTime.now());
        maintenanceRepo.save(req);
        return ResponseEntity.ok(req);
    }
}