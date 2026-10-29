package com.study.backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.study.backend.entities.CoursePurchase;
import com.study.backend.entities.TestCategory;

public interface CoursePurchaseRepository extends JpaRepository<CoursePurchase, String> {
    List<CoursePurchase> findByUser_IdOrderByPurchasedAtDesc(String userId);
    void deleteAllByUser_Id(String userId);
    boolean existsByUser_IdAndCourse_Id(String userId, String courseId);
    void deleteAllByCourse_Id(String courseId);
    void deleteByUser_IdAndCourse_Id(String userId, String courseId);
    Optional<CoursePurchase> findByUser_IdAndCourse_Id(String userId, String courseId);
    boolean existsByUser_IdAndCourse_CategoryAndLearningCompletedTrue(String userId, TestCategory category);
}
