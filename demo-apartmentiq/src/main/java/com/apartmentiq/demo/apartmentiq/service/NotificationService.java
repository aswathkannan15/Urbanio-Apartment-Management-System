package com.apartmentiq.demo.apartmentiq.service;

import com.apartmentiq.demo.apartmentiq.dto.NotifDTO;
import com.apartmentiq.demo.apartmentiq.entity.Notification;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notifRepo;

    public List<NotifDTO> getMyNotifications(Long userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(n -> NotifDTO.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .type(n.getType())
                        .targetId(n.getTargetId())
                        .actionStatus(n.getActionStatus())
                        .isRead(n.getIsRead())
                        .createdAt(n.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notifRepo.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notifRepo.markAllReadForUser(userId);
    }

    public void createBookingNotification(User user, String facilityName, String date) {
        notifRepo.save(Notification.builder()
                .user(user).type("BOOKING").isRead(false)
                .createdAt(LocalDateTime.now())
                .message("Booking confirmed: " + facilityName + " on " + date)
                .build());
    }

    public void createVisitorRequestNotification(User user, String visitorName, Long visitorId) {
        notifRepo.save(Notification.builder()
                .user(user).type("VISITOR_REQUEST").isRead(false)
                .targetId(visitorId)
                .actionStatus("PENDING")
                .createdAt(LocalDateTime.now())
                .message("🚨 Visitor '" + visitorName + "' is waiting at the main gate. Do you approve?")
                .build());
    }
}