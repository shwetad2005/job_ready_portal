package com.study.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.study.backend.entities.Course;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByActiveTrueOrderByCreatedAtDesc();
}
