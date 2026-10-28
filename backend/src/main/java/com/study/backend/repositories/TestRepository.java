package com.study.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.study.backend.entities.Test;
import com.study.backend.entities.TestCategory;

@Repository
public interface TestRepository extends JpaRepository<Test, String> {

    List<Test> findByIsActiveTrueOrderByDeadlineAsc();

    List<Test> findByOrderByCreatedAtDesc();

    List<Test> findByIsPublishedTrueAndIsActiveTrueOrderByDeadlineAsc();

    List<Test> findByCategoryAndIsPublishedTrueAndIsActiveTrueOrderByDeadlineAsc(TestCategory category);
}
