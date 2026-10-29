package com.study.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.study.backend.entities.TestAttempt;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, String> {

    @EntityGraph(attributePaths = {"user", "test", "answers", "answers.question"})
    List<TestAttempt> findAllByOrderByAttemptedAtDesc();

    @EntityGraph(attributePaths = {"user", "test"})
    List<TestAttempt> findByUser_IdOrderByAttemptedAtDesc(String userId);

    boolean existsByUser_IdAndTest_Id(String userId, String testId);

    List<TestAttempt> findByUser_Id(String userId);
}
