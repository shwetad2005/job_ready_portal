package com.study.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.study.backend.entities.Question;
import com.study.backend.entities.TestCategory;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query("SELECT q FROM Question q WHERE q.test IS NOT NULL AND q.test.id = :testId")
    List<Question> findByTestId(@Param("testId") String testId);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.test.id = :testId")
    long countByTestId(@Param("testId") String testId);

    @Query("""
            SELECT q FROM Question q
            JOIN q.test sourceTest
            WHERE sourceTest.category = :category
              AND sourceTest.id <> :testId
              AND NOT EXISTS (
                  SELECT existing.id FROM Question existing
                  WHERE existing.test.id = :testId
                    AND LOWER(TRIM(existing.questionText)) = LOWER(TRIM(q.questionText))
              )
            ORDER BY q.createdAt DESC
            """)
    List<Question> findReusableByTestCategory(
            @Param("category") TestCategory category,
            @Param("testId") String testId);

    @Query("""
            SELECT CASE WHEN COUNT(q) > 0 THEN true ELSE false END
            FROM Question q
            WHERE q.test.id = :testId
              AND LOWER(TRIM(q.questionText)) = LOWER(TRIM(:questionText))
            """)
    boolean existsInTestByQuestionText(
            @Param("testId") String testId,
            @Param("questionText") String questionText);

    @Query("SELECT COALESCE(SUM(q.marks), 0) FROM Question q WHERE q.test.id = :testId")
    int sumMarksByTestId(@Param("testId") String testId);
}
