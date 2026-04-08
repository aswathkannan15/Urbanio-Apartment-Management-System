package com.apartmentiq.demo.apartmentiq.service;


import com.apartmentiq.demo.apartmentiq.dto.*;
        import com.apartmentiq.demo.apartmentiq.entity.*;
        import com.apartmentiq.demo.apartmentiq.exception.SlotAlreadyBookedException;
import com.apartmentiq.demo.apartmentiq.repository.*;
        import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository  bookingRepo;
    private final TimeSlotRepository timeSlotRepo;
    private final FacilityRepository facilityRepo;
    private final UserRepository     userRepo;

    // ─────────────────────────────────────────────────────────────
    // THIS IS YOUR INTERVIEW STORY — explain every line
    // @Transactional = the entire method runs as ONE database operation.
    // If anything fails halfway, EVERYTHING is rolled back.
    // findByIdWithLock = MySQL locks the slot row with SELECT FOR UPDATE.
    // No other transaction can read or write this row until we're done.
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public BookingResponse book(Long residentId, BookingRequest req) {

        // Step 1: Lock the slot row in MySQL
        // Any other booking attempt for this slot WAITS here
        TimeSlot slot = timeSlotRepo.findByIdWithLock(req.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Step 2: Check if it's still available
        // (the waiting request sees BOOKED here and gets rejected)
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new SlotAlreadyBookedException(
                    "This slot is already booked. Please choose another time."
            );
        }

        // Step 3: Mark slot as BOOKED
        slot.setStatus(SlotStatus.BOOKED);
        timeSlotRepo.save(slot);

        // Step 4: Create the booking record
        User     resident = userRepo.findById(residentId).orElseThrow();
        Facility facility = facilityRepo.findById(req.getFacilityId()).orElseThrow();

        Booking booking = Booking.builder()
                .resident(resident)
                .facility(facility)
                .slot(slot)
                .memberCount(req.getMemberCount())
                .purpose(req.getPurpose())
                .status(BookingStatus.CONFIRMED)
                .bookedAt(LocalDateTime.now())
                .build();

        bookingRepo.save(booking);

        // Step 5: Return confirmation to React
        return toResponse(booking);
    }

    // ── Cancel a booking ──────────────────────────────────────────
    @Transactional
    public BookingResponse cancel(Long bookingId, Long residentId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Security check — only the owner can cancel their booking
        if (!booking.getResident().getId().equals(residentId)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        // Free up the slot so others can book it
        TimeSlot slot = booking.getSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        timeSlotRepo.save(slot);

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);

        return toResponse(booking);
    }

    // ── Get my bookings ───────────────────────────────────────────
    public List<BookingResponse> getMyBookings(Long residentId) {
        return bookingRepo
                .findByResidentIdOrderByBookedAtDesc(residentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Entity → DTO ──────────────────────────────────────────────
    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .facilityName(b.getFacility().getName())
                .slotDate(b.getSlot().getSlotDate().toString())
                .startTime(b.getSlot().getStartTime().toString())
                .endTime(b.getSlot().getEndTime().toString())
                .status(b.getStatus().name())
                .purpose(b.getPurpose())
                .memberCount(b.getMemberCount())
                .bookedAt(b.getBookedAt().toString())
                .build();
    }
}
