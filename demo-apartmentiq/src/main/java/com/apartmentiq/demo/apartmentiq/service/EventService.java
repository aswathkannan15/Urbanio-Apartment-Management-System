package com.apartmentiq.demo.apartmentiq.service;
import com.apartmentiq.demo.apartmentiq.Role;
import com.apartmentiq.demo.apartmentiq.dto.CreateEventRequest;
import com.apartmentiq.demo.apartmentiq.dto.EventDTO;
import com.apartmentiq.demo.apartmentiq.entity.Event;
import com.apartmentiq.demo.apartmentiq.entity.EventRegistration;
import com.apartmentiq.demo.apartmentiq.entity.Notification;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.EventRegistrationRepository;
import com.apartmentiq.demo.apartmentiq.repository.EventRepository;
import com.apartmentiq.demo.apartmentiq.repository.NotificationRepository;
import com.apartmentiq.demo.apartmentiq.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepo;
    private final NotificationRepository notifRepo;
    private final UserRepository userRepo;
    private final EventRegistrationRepository registrationRepo;

    public List<EventDTO> getAll() {
        return eventRepo.findByIsActiveTrueOrderByEventDateAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Admin creates event → notify ALL residents
    @Transactional
    public EventDTO create(CreateEventRequest req, Long adminId) {
        User admin = userRepo.findById(adminId).orElseThrow();
        Event event = Event.builder()
                .title(req.getTitle()).description(req.getDescription())
                .eventDate(req.getEventDate()).maxCapacity(req.getMaxCapacity())
                .venue(req.getVenue()).createdBy(admin).isActive(true).build();
        eventRepo.save(event);

        // Notify every resident
        userRepo.findAll().stream()
                .filter(u -> u.getRole() == Role.RESIDENT)
                .forEach(u -> notifRepo.save(Notification.builder()
                        .user(u).type("EVENT").isRead(false)
                        .createdAt(LocalDateTime.now())
                        .message("New event: " + req.getTitle()
                                + " on " + req.getEventDate().toLocalDate())
                        .build()));
        return toDTO(event);
    }
    
    @Transactional
    public String registerForEvent(Long eventId, Long userId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepo.findById(userId).orElseThrow();
        
        if (registrationRepo.findByEventIdAndUserId(eventId, userId).isPresent()) {
            throw new RuntimeException("Already registered for this event");
        }
        
        long currentRegistrations = registrationRepo.countByEventId(eventId);
        if (currentRegistrations >= event.getMaxCapacity()) {
            throw new RuntimeException("Event is fully booked");
        }
        
        EventRegistration registration = EventRegistration.builder()
                .event(event).user(user).registrationTime(LocalDateTime.now()).build();
        registrationRepo.save(registration);
        return "Successfully registered for event";
    }

    private EventDTO toDTO(Event e) {
        return EventDTO.builder().id(e.getId()).title(e.getTitle())
                .description(e.getDescription())
                .eventDate(e.getEventDate().toString())
                .maxCapacity(e.getMaxCapacity()).venue(e.getVenue()).build();
    }
}
