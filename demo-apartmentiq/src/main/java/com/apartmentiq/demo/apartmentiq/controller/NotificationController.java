package com.apartmentiq.demo.apartmentiq.controller;


import com.apartmentiq.demo.apartmentiq.dto.NotifDTO;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notifService;

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<NotifDTO>> getAll(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notifService.getMyNotifications(user.getId()));
    }

    @GetMapping(value = "/unread-count", produces = "application/json")
    public ResponseEntity<Map<String, Long>> unreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                Map.of("count", notifService.getUnreadCount(user.getId())));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> readAll(@AuthenticationPrincipal User user) {
        notifService.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "Done"));
    }
}