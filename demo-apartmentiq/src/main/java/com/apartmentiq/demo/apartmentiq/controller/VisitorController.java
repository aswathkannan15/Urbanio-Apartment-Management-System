package com.apartmentiq.demo.apartmentiq.controller;

import com.apartmentiq.demo.apartmentiq.dto.PreApproveRequest;
import com.apartmentiq.demo.apartmentiq.dto.VisitorCheckinRequest;
import com.apartmentiq.demo.apartmentiq.dto.VisitorDTO;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {
    private final VisitorService visitorService;

    // Security logs arrival
    @PostMapping("/checkin")
    public ResponseEntity<VisitorDTO> checkin(@RequestBody VisitorCheckinRequest req) {
        return ResponseEntity.ok(visitorService.checkin(req));
    }

    // Resident approves/rejects arrival
    @PutMapping("/{id}/respond")
    public ResponseEntity<VisitorDTO> respond(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(visitorService.respondToRequest(id, status, user.getId()));
    }

    // Security checks if pending visitor is approved
    @GetMapping("/{id}/status")
    public ResponseEntity<VisitorDTO> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(visitorService.getVisitorById(id));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<VisitorDTO> checkout(@PathVariable Long id) {
        return ResponseEntity.ok(visitorService.checkout(id));
    }

    @PostMapping("/pre-approve")
    public ResponseEntity<Map<String,String>> preApprove(
            @RequestBody PreApproveRequest req,
            @AuthenticationPrincipal User user) {
        visitorService.preApprove(req, user.getId());
        return ResponseEntity.ok(Map.of("message", "Guest pre-approved. They can enter upon arrival."));
    }

    @GetMapping("/today")
    public ResponseEntity<List<VisitorDTO>> today() {
        return ResponseEntity.ok(visitorService.getTodayVisitors());
    }
}