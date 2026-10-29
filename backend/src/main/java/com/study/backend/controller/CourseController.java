package com.study.backend.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.study.backend.dtos.CourseRequestDto;
import com.study.backend.entities.Course;
import com.study.backend.entities.CoursePurchase;
import com.study.backend.entities.User;
import com.study.backend.repositories.CoursePurchaseRepository;
import com.study.backend.repositories.CourseRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseRepository courses;
    private final CoursePurchaseRepository purchases;

    public CourseController(CourseRepository courses, CoursePurchaseRepository purchases) {
        this.courses = courses;
        this.purchases = purchases;
    }

    @GetMapping
    public List<Course> listCourses() { return courses.findByActiveTrueOrderByCreatedAtDesc(); }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseRequestDto request) {
        Course course = new Course();
        course.setTitle(request.getTitle().trim());
        course.setDescription(request.getDescription().trim());
        course.setPrice(request.getPrice());
        return ResponseEntity.status(HttpStatus.CREATED).body(courses.save(course));
    }

    @GetMapping("/mine")
    public List<CoursePurchase> myCourses(@AuthenticationPrincipal User user) {
        return purchases.findByUser_IdOrderByPurchasedAtDesc(user.getId());
    }

    @PostMapping("/{courseId}/purchase")
    public ResponseEntity<?> purchase(@PathVariable String courseId, @AuthenticationPrincipal User user) {
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
}
