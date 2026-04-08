package com.apartmentiq.demo.apartmentiq.repository;


import com.apartmentiq.demo.apartmentiq.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// ── CommunityPostRepository.java ──────────────────────
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByIsActiveTrueOrderByCreatedAtDesc();
}