package com.apartmentiq.demo.apartmentiq.controller;

import com.apartmentiq.demo.apartmentiq.dto.CreateEventRequest;
import com.apartmentiq.demo.apartmentiq.dto.EventDTO;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAll() {
        return ResponseEntity.ok(eventService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventDTO> create(
            @RequestBody CreateEventRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.create(req, user.getId()));
    }
    
    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> register(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user) {
        try {
            String msg = eventService.registerForEvent(eventId, user.getId());
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}