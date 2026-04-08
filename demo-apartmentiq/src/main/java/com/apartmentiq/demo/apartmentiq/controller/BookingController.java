package com.apartmentiq.demo.apartmentiq.controller;

import com.apartmentiq.demo.apartmentiq.dto.*;
        import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings
    // @AuthenticationPrincipal gets the logged-in user from SecurityContext
    // (set there by JwtAuthFilter — this is why the filter matters!)
    @PostMapping
    public ResponseEntity<BookingResponse> book(
            @Valid @RequestBody BookingRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.book(user.getId(), req));
    }

    // GET /api/bookings/my
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user.getId()));
    }

    // PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancel(id, user.getId()));
    }
}