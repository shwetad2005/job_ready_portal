package com.study.backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.study.backend.entities.CoursePurchase;

public interface CoursePurchaseRepository extends JpaRepository<CoursePurchase, String> {
    List<CoursePurchase> findByUser_IdOrderByPurchasedAtDesc(String userId);
    void deleteAllByUser_Id(String userId);
    boolean existsByUser_IdAndCourse_Id(String userId, String courseId);
}
