package com.apartmentiq.demo.apartmentiq.controller;

import com.apartmentiq.demo.apartmentiq.dto.*;
        import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.entity.Notification;
import com.apartmentiq.demo.apartmentiq.repository.NotificationRepository;
import com.apartmentiq.demo.apartmentiq.repository.UserRepository;
import com.apartmentiq.demo.apartmentiq.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
        import org.springframework.security.authentication.*;
        import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
        import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository        userRepo;
    private final NotificationRepository notifRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil               jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already registered"));

        User user = User.builder()
                .name(req.getName()).email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole()).flatNo(req.getFlatNo())
                .phone(req.getPhone())
                .isApproved(req.getRole() == com.apartmentiq.demo.apartmentiq.Role.ADMIN)
                .build();

        userRepo.save(user);
        
        // Notify admins if pending approval
        if (!user.getIsApproved()) {
            userRepo.findByRole(com.apartmentiq.demo.apartmentiq.Role.ADMIN).forEach(admin -> {
                notifRepo.save(Notification.builder()
                        .user(admin).type("ANNOUNCEMENT").isRead(false)
                        .createdAt(LocalDateTime.now())
                        .message("New registration pending approval: " + user.getName() + " (" + user.getRole() + ")")
                        .build());
            });
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail(), req.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        if (!user.getIsApproved()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Account pending admin approval"));
        }
        String jwt  = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(
                jwt, user.getRole().name(), user.getName(),
                user.getId(), user.getEmail(), user.getFlatNo()));
    }
}