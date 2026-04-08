package com.apartmentiq.demo.apartmentiq.controller;

import com.apartmentiq.demo.apartmentiq.entity.CommunityPost;
import com.apartmentiq.demo.apartmentiq.entity.User;
import com.apartmentiq.demo.apartmentiq.repository.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityPostRepository postRepo;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(postRepo
                .findByIsActiveTrueOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CommunityPost post,
                                    @AuthenticationPrincipal User user) {
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setIsActive(true);
        postRepo.save(post);
        return ResponseEntity.ok(post);
    }
}