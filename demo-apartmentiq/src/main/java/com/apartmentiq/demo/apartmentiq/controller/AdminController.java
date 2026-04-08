package com.apartmentiq.demo.apartmentiq.controller;


import com.apartmentiq.demo.apartmentiq.Role;
import com.apartmentiq.demo.apartmentiq.entity.Notification;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BookingRepository     bookingRepo;

    private final UserRepository        userRepo;
    private final MaintenanceRepository maintenanceRepo;
    private final VisitorRepository     visitorRepo;
    private final NotificationRepository notifRepo;

    // ── Analytics overview ────────────────────────────
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> analytics() {
        List<Object[]> raw = bookingRepo.countBookingsPerFacility();
        List<Map<String,Object>> byFacility = raw.stream()
                .map(r -> Map.of("name", r[0], "bookings", r[1]))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "byFacility",      byFacility,
                "totalResidents",  userRepo.countByRole(Role.RESIDENT),
                "totalBookings",   bookingRepo.count(),
                "openMaintenance", maintenanceRepo.countByStatus("OPEN"),
                "todayVisitors",   visitorRepo.countByInTimeAfter(
                        LocalDateTime.now().toLocalDate().atStartOfDay())
        ));
    }

    // ── All visitors (not just today) ─────────────────
    @GetMapping("/visitors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> allVisitors(
            @RequestParam(defaultValue = "today") String filter) {
        LocalDateTime from = filter.equals("today")
                ? LocalDateTime.now().toLocalDate().atStartOfDay()
                : LocalDateTime.now().minusDays(30);  // last 30 days
        return ResponseEntity.ok(visitorRepo.findByInTimeAfterOrderByInTimeDesc(from));
    }

    // ── All residents — approve / view ────────────────
    @GetMapping("/residents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> residents() {
        return ResponseEntity.ok(userRepo.findByRole(Role.RESIDENT));
    }

    // ── Approve a resident (if isApproved=false flow) ─
    @PutMapping("/residents/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        User u = userRepo.findById(id).orElseThrow();
        u.setIsApproved(true);
        userRepo.save(u);
        return ResponseEntity.ok(Map.of("message", "Resident approved"));
    }

    // ── Broadcast announcement to all residents ────────
    @PostMapping("/announce")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> announce(
            @RequestBody Map<String,String> body,
            @AuthenticationPrincipal User admin) {
        String msg = body.get("message");
        userRepo.findByRole(Role.RESIDENT).forEach(u ->
                notifRepo.save(Notification.builder()
                        .user(u).type("ANNOUNCEMENT").isRead(false)
                        .createdAt(LocalDateTime.now()).message(msg)
                        .build())
        );
        return ResponseEntity.ok(Map.of("message", "Announced to all residents"));
    }
}
