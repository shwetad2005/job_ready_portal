package com.study.backend.controller;

import java.util.List;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLDecoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.study.backend.dtos.CourseRequestDto;
import com.study.backend.dtos.CourseLearningResponseDto;
import com.study.backend.entities.Course;
import com.study.backend.entities.CoursePurchase;
import com.study.backend.entities.User;
import com.study.backend.repositories.CoursePurchaseRepository;
import com.study.backend.repositories.CourseRepository;
import com.study.backend.services.CourseFileStorageService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseRepository courses;
    private final CoursePurchaseRepository purchases;
    private final CourseFileStorageService fileStorage;

    public CourseController(CourseRepository courses, CoursePurchaseRepository purchases, CourseFileStorageService fileStorage) {
        this.courses = courses;
        this.purchases = purchases;
        this.fileStorage = fileStorage;
    }

    @GetMapping
    public List<Course> listCourses() { return courses.findByActiveTrueOrderByCreatedAtDesc(); }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @ModelAttribute CourseRequestDto request) {
        if ((request.getLearningContent() == null || request.getLearningContent().isBlank())
                && (request.getLearningFile() == null || request.getLearningFile().isEmpty())) {
            return ResponseEntity.badRequest().build();
        }
        Course course = new Course();
        course.setTitle(request.getTitle().trim());
        course.setDescription(request.getDescription().trim());
        course.setCategory(request.getCategory());
        if (request.getSubtopic().getCategory() != request.getCategory()) {
            return ResponseEntity.badRequest().build();
        }
        if (request.getYoutubeUrl() != null && !request.getYoutubeUrl().isBlank()
                && extractYouTubeVideoId(request.getYoutubeUrl()) == null) {
            return ResponseEntity.badRequest().build();
        }
        course.setSubtopic(request.getSubtopic());
        course.setLearningContent(request.getLearningContent() == null ? "" : request.getLearningContent().trim());
        course.setYoutubeUrl(request.getYoutubeUrl() == null ? null : request.getYoutubeUrl().trim());
        course.setPrice(BigDecimal.ZERO);
        CourseFileStorageService.StoredCourseFile storedFile = fileStorage.store(request.getLearningFile());
        if (storedFile != null) {
            course.setLearningFileName(storedFile.originalName());
            course.setLearningFileStorageKey(storedFile.storageKey());
            course.setLearningFileContentType(storedFile.contentType());
            course.setLearningFileSize(storedFile.size());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(courses.save(course));
    }

    @GetMapping("/mine")
    public List<CoursePurchase> myCourses(@AuthenticationPrincipal User user) {
        return purchases.findByUser_IdOrderByPurchasedAtDesc(user.getId());
    }

    @GetMapping("/{courseId}/learn")
    public ResponseEntity<CourseLearningResponseDto> getLearningMaterial(
            @PathVariable String courseId, @AuthenticationPrincipal User user) {
        return purchases.findByUser_IdAndCourse_Id(user.getId(), courseId)
                .map(purchase -> {
                    Course course = purchase.getCourse();
                    return ResponseEntity.ok(new CourseLearningResponseDto(
                            course.getId(), course.getTitle(), course.getDescription(),
                            course.getLearningContent(), course.getCategory(), course.getSubtopic(),
                            purchase.isLearningCompleted(), course.getLearningFileName(), course.getYoutubeUrl()));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{courseId}/material")
    public ResponseEntity<Resource> downloadLearningFile(
            @PathVariable String courseId, @AuthenticationPrincipal User user) {
        Course course = purchases.findByUser_IdAndCourse_Id(user.getId(), courseId)
                .map(CoursePurchase::getCourse)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND));
        Resource file = fileStorage.load(course.getLearningFileStorageKey());
        boolean isPdf = course.getLearningFileName() != null
                && course.getLearningFileName().toLowerCase(java.util.Locale.ROOT).endsWith(".pdf");
        org.springframework.http.ContentDisposition disposition = isPdf
                ? org.springframework.http.ContentDisposition.inline()
                        .filename(course.getLearningFileName(), StandardCharsets.UTF_8).build()
                : org.springframework.http.ContentDisposition.attachment()
                        .filename(course.getLearningFileName(), StandardCharsets.UTF_8).build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header("X-Content-Type-Options", "nosniff")
                .header(HttpHeaders.CONTENT_TYPE, course.getLearningFileContentType())
                .body(file);
    }

    @PostMapping("/{courseId}/complete")
    public ResponseEntity<Void> completeLearning(
            @PathVariable String courseId, @AuthenticationPrincipal User user) {
        return purchases.findByUser_IdAndCourse_Id(user.getId(), courseId)
                .map(purchase -> {
                    purchase.setLearningCompleted(true);
                    purchases.save(purchase);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{courseId}/enrollment")
    public ResponseEntity<Void> removeEnrollment(
            @PathVariable String courseId, @AuthenticationPrincipal User user) {
        if (!purchases.existsByUser_IdAndCourse_Id(user.getId(), courseId)) {
            return ResponseEntity.notFound().build();
        }
        purchases.deleteByUser_IdAndCourse_Id(user.getId(), courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enroll(@PathVariable String courseId, @AuthenticationPrincipal User user) {
        Course course = courses.findById(courseId).filter(Course::isActive).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();
        if (purchases.existsByUser_IdAndCourse_Id(user.getId(), courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "You already own this course."));
        }
        CoursePurchase purchase = new CoursePurchase();
        purchase.setUser(user);
        purchase.setCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(purchases.save(purchase));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String courseId) {
        Course course = courses.findById(courseId).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();

        purchases.deleteAllByCourse_Id(courseId);
        fileStorage.delete(course.getLearningFileStorageKey());
        courses.delete(course);
        return ResponseEntity.noContent().build();
    }

    private String extractYouTubeVideoId(String url) {
        try {
            URI uri = URI.create(url.trim());
            String host = uri.getHost();
            if (host == null || !(host.equalsIgnoreCase("youtube.com")
                    || host.equalsIgnoreCase("www.youtube.com")
                    || host.equalsIgnoreCase("m.youtube.com")
                    || host.equalsIgnoreCase("youtu.be"))) return null;

            String videoId = null;
            if (host.toLowerCase(java.util.Locale.ROOT).endsWith("youtu.be")) {
                videoId = uri.getPath().replaceFirst("^/", "").split("/")[0];
            } else if (uri.getPath().equals("/watch")) {
                for (String item : uri.getRawQuery() == null ? new String[0] : uri.getRawQuery().split("&")) {
                    String[] pair = item.split("=", 2);
                    if (pair.length == 2 && pair[0].equals("v")) {
                        videoId = URLDecoder.decode(pair[1], StandardCharsets.UTF_8);
                        break;
                    }
                }
            } else if (uri.getPath().matches("/(embed|shorts|live)/[^/]+/?")) {
                videoId = uri.getPath().split("/")[2];
            }
            return videoId != null && videoId.matches("[A-Za-z0-9_-]{11}") ? videoId : null;
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }
}
