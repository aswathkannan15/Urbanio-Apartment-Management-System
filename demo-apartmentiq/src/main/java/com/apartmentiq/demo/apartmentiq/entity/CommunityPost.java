package com.apartmentiq.demo.apartmentiq.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="community_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPost {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="author_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User author;

    private String category; // NOTICE, SALE, LOST_FOUND, HELP, GENERAL
    private String title;
    private String content;
    private LocalDateTime createdAt;
    @Builder.Default
    private Boolean isActive = true;
}