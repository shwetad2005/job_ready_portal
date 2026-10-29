package com.study.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.study.backend.entities.TestCategory;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TestCategory category = TestCategory.APTITUDE;

    @Enumerated(EnumType.STRING)
    @Column(length = 60)
    private CourseSubtopic subtopic;

    @Column(columnDefinition = "TEXT")
    @JsonIgnore
    private String learningContent;

    @Column(length = 500)
    private String youtubeUrl;

    @Column(length = 255)
    private String learningFileName;

    @Column(length = 100)
    @JsonIgnore
    private String learningFileStorageKey;

    @Column(length = 150)
    private String learningFileContentType;

    private Long learningFileSize;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); }
}
