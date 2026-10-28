package com.study.backend.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.backend.entities.Test;
import com.study.backend.entities.TestAttempt;
import com.study.backend.entities.TestCategory;
import com.study.backend.repositories.TestAttemptRepository;
import com.study.backend.repositories.TestRepository;
import com.study.backend.repositories.QuestionRepository;
import com.study.backend.services.TestService;


@Service
public class TestServiceImpl implements TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public Test createTest(Test test) {
        test.setIsPublished(false);
        test.setQuestionCount(0);

        // Use configured duration if provided, otherwise calculate based on total marks
        if (test.getDurationMinutes() == null || test.getDurationMinutes() <= 0) {
            int maxQuestions = test.getTotalMarks() / (test.getMarksPerQuestion() != null ? test.getMarksPerQuestion() : 1);
            // For 50-mark tests, use 60 minutes. For others, use 1 minute per question minimum
            int suggestedDuration = test.getTotalMarks() == 50 ? 60 : Math.max(maxQuestions, 20);
            test.setDurationMinutes(suggestedDuration);
        }

        return testRepository.save(test);
    }

    @Override
    public Test getTestById(String id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found with ID: " + id));
        // Update question count dynamically
        long count = questionRepository.countByTestId(id);
        test.setQuestionCount((int) count);

        // Update total marks from questions
        int totalMarks = questionRepository.sumMarksByTestId(id);
        test.setTotalMarks(totalMarks);

        // Update duration based on total marks (60 minutes for 50-mark tests, otherwise 1 min per question minimum)
        int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
        test.setDurationMinutes(suggestedDuration);

        return test;
    }

    @Override
    public List<Test> getAllTests() {
        List<Test> tests = testRepository.findByOrderByCreatedAtDesc();
        // Update question counts, total marks, and duration for all tests
        tests.forEach(test -> {
            long count = questionRepository.countByTestId(test.getId());
            test.setQuestionCount((int) count);
            int totalMarks = questionRepository.sumMarksByTestId(test.getId());
            test.setTotalMarks(totalMarks);
            int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
            test.setDurationMinutes(suggestedDuration);
        });
        return tests;
    }

    @Override
    public List<Test> getActiveTests() {
        List<Test> tests = testRepository.findByIsActiveTrueOrderByDeadlineAsc();
        tests.forEach(test -> {
            long count = questionRepository.countByTestId(test.getId());
            test.setQuestionCount((int) count);
            int totalMarks = questionRepository.sumMarksByTestId(test.getId());
            test.setTotalMarks(totalMarks);
            int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
            test.setDurationMinutes(suggestedDuration);
        });
        return tests;
    }

    @Override
    public List<Test> getPublishedTests() {
        List<Test> tests = testRepository.findByIsPublishedTrueAndIsActiveTrueOrderByDeadlineAsc();
        tests.forEach(test -> {
            long count = questionRepository.countByTestId(test.getId());
            test.setQuestionCount((int) count);
            int totalMarks = questionRepository.sumMarksByTestId(test.getId());
            test.setTotalMarks(totalMarks);
            int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
            test.setDurationMinutes(suggestedDuration);
        });
        return tests;
    }

    @Override
    public List<Test> getPublishedTestsByCategory(TestCategory category) {
        List<Test> tests = testRepository
                .findByCategoryAndIsPublishedTrueAndIsActiveTrueOrderByDeadlineAsc(category);
        tests.forEach(test -> {
            long count = questionRepository.countByTestId(test.getId());
            test.setQuestionCount((int) count);
            int totalMarks = questionRepository.sumMarksByTestId(test.getId());
            test.setTotalMarks(totalMarks);
            int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
            test.setDurationMinutes(suggestedDuration);
        });
        return tests;
    }

    @Override
    public Test publishTest(String id) {
        Test test = getTestById(id);
        test.setIsPublished(true);
        return testRepository.save(test);
    }

    @Override
    public Test updateTest(String id, Test test) {
        Test existingTest = getTestById(id);

        existingTest.setTitle(test.getTitle());
        existingTest.setDescription(test.getDescription());
        if (test.getCategory() != null) {
            existingTest.setCategory(test.getCategory());
        }
        existingTest.setDeadline(test.getDeadline());
        
        // Only update marksPerQuestion if test is not published
        if (!Boolean.TRUE.equals(existingTest.getIsPublished()) && test.getMarksPerQuestion() != null) {
            existingTest.setMarksPerQuestion(test.getMarksPerQuestion());
        }
        
        // Duration and total marks are auto-calculated from questions, not from form input
        existingTest.setIsActive(test.getIsActive());
        existingTest.setIsPublished(
                Boolean.TRUE.equals(existingTest.getIsPublished())
                        || Boolean.TRUE.equals(test.getIsPublished()));

        return testRepository.save(existingTest);
    }

    @Override
    @Transactional
    public void deleteTest(String id) {
        Test test = getTestById(id);
        
        // Delete all test attempts for this test first
        List<TestAttempt> attempts = testAttemptRepository.findAll();
        attempts.stream()
            .filter(attempt -> attempt.getTest() != null && attempt.getTest().getId().equals(id))
            .forEach(attempt -> testAttemptRepository.delete(attempt));
        
        // Clear questions to avoid cascade issues
        if (test.getQuestions() != null) {
            test.getQuestions().clear();
        }
        testRepository.save(test);
        testRepository.delete(test);
    }
}
