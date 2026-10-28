
package com.study.backend.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.backend.services.QuestionService;
import com.study.backend.dtos.BulkQuestionImportDto;
import com.study.backend.dtos.QuestionImportDto;
import com.study.backend.entities.Question;
import com.study.backend.entities.Test;
import com.study.backend.entities.TestCategory;
import com.study.backend.repositories.QuestionRepository;
import com.study.backend.repositories.TestRepository;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestRepository testRepository;

    private void updateTestQuestionCount(Test test) {
        if (test != null) {
            long count = questionRepository.countByTestId(test.getId());
            test.setQuestionCount((int) count);

            // Auto-calculate total marks from questions
            int totalMarks = questionRepository.sumMarksByTestId(test.getId());
            test.setTotalMarks(totalMarks);

            // Auto-calculate duration based on total marks (60 minutes for 50-mark tests, otherwise 1 min per question minimum)
            int suggestedDuration = totalMarks == 50 ? 60 : Math.max((int) count, 30);
            test.setDurationMinutes(suggestedDuration);

            testRepository.save(test);
        }
    }

    // Create a new question
    @Override
    public Question createQuestion(Question question) {
        Test test = null;
        // If testId is provided, set the test relationship
        if (question.getTestId() != null && !question.getTestId().isEmpty()) {
            test = testRepository.findById(question.getTestId())
                    .orElseThrow(() -> new RuntimeException("Test not found with ID: " + question.getTestId()));
            ensureTestQuestionsCanBeModified(test);
            question.setTest(test);
            question.setCategory(categoryLabel(test.getCategory()));

            // For 50-mark tests, force 1 mark per question
            if (test.getTotalMarks() != null && test.getTotalMarks() == 50) {
                question.setMarks(1);
            } else {
                // Use test's marksPerQuestion as default if question marks not set
                if (question.getMarks() == null || question.getMarks() == 0) {
                    question.setMarks(test.getMarksPerQuestion() != null ? test.getMarksPerQuestion() : 1);
                }
            }
        } else if (question.getCategory() == null || question.getCategory().isBlank()) {
            question.setCategory("Aptitude");
        }
        Question saved = questionRepository.save(question);
        updateTestQuestionCount(test);
        return saved;
    }

    // Get all questions
    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public List<Question> getReusableQuestions(String testId) {
        Test targetTest = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found with ID: " + testId));
        return questionRepository.findReusableByTestCategory(
                targetTest.getCategory(), targetTest.getId());
    }

    @Override
    @Transactional
    public Question copyQuestionToTest(Integer questionId, String testId) {
        Test targetTest = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found with ID: " + testId));
        ensureTestQuestionsCanBeModified(targetTest);

        Question source = getQuestionIdForCopy(questionId, targetTest);
        if (questionRepository.existsInTestByQuestionText(
                targetTest.getId(), source.getQuestionText())) {
            throw new IllegalArgumentException(
                    "This question is already included in the selected test.");
        }
        return questionRepository.save(copyForTest(source, targetTest));
    }

    @Override
    @Transactional
    public List<Question> copyQuestionsToTest(List<Integer> questionIds, String testId) {
        Test targetTest = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found with ID: " + testId));
        ensureTestQuestionsCanBeModified(targetTest);

        List<Question> sources = questionIds.stream()
                .distinct()
                .map(questionId -> getQuestionIdForCopy(questionId, targetTest))
                .toList();
        List<Question> copies = new java.util.ArrayList<>();
        java.util.Set<String> questionTexts = new java.util.HashSet<>();

        for (Question source : sources) {
            String normalizedText = source.getQuestionText().trim().toLowerCase(java.util.Locale.ROOT);
            if (questionTexts.add(normalizedText)
                    && !questionRepository.existsInTestByQuestionText(
                            targetTest.getId(), source.getQuestionText())) {
                copies.add(copyForTest(source, targetTest));
            }
        }

        return questionRepository.saveAll(copies);
    }

    private Question getQuestionIdForCopy(Integer questionId, Test targetTest) {
        Question source = getQuestionById(questionId);
        if (source.getTest() == null
                || source.getTest().getCategory() != targetTest.getCategory()) {
            throw new IllegalArgumentException(
                    "Questions can only be reused in tests with the same category.");
        }
        return source;
    }

    private Question copyForTest(Question source, Test targetTest) {
        Question copy = new Question();
        copy.setQuestionText(source.getQuestionText());
        copy.setCategory(categoryLabel(targetTest.getCategory()));
        copy.setOptionA(source.getOptionA());
        copy.setOptionB(source.getOptionB());
        copy.setOptionC(source.getOptionC());
        copy.setOptionD(source.getOptionD());
        copy.setCorrectAnswer(source.getCorrectAnswer());
        copy.setExplanation(source.getExplanation());
        copy.setMarks(source.getMarks());
        copy.setTest(targetTest);
        return copy;
    }

    // Get a question by ID
    @Override
    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + id));
    }

    // Update an existing question
    @Override
    public Question updateQuestion(Integer id, Question question) {
        Question existingQuestion = getQuestionById(id);
        Test oldTest = existingQuestion.getTest();
        if (oldTest != null) {
            ensureTestQuestionsCanBeModified(oldTest);
        }

        existingQuestion.setQuestionText(question.getQuestionText());
        existingQuestion.setOptionA(question.getOptionA());
        existingQuestion.setOptionB(question.getOptionB());
        existingQuestion.setOptionC(question.getOptionC());
        existingQuestion.setOptionD(question.getOptionD());
        existingQuestion.setCorrectAnswer(question.getCorrectAnswer());
        existingQuestion.setExplanation(question.getExplanation());

        // Update test relationship if testId is provided
        if (question.getTestId() != null && !question.getTestId().isEmpty()) {
            Test test = testRepository.findById(question.getTestId())
                    .orElseThrow(() -> new RuntimeException("Test not found with ID: " + question.getTestId()));
            ensureTestQuestionsCanBeModified(test);
            existingQuestion.setTest(test);
            existingQuestion.setCategory(categoryLabel(test.getCategory()));

            // For 50-mark tests, force 1 mark per question
            if (test.getTotalMarks() != null && test.getTotalMarks() == 50) {
                existingQuestion.setMarks(1);
            } else {
                existingQuestion.setMarks(question.getMarks());
            }
        } else if (question.getTestId() != null && question.getTestId().isEmpty()) {
            existingQuestion.setTest(null);
            existingQuestion.setCategory(
                    question.getCategory() == null || question.getCategory().isBlank()
                            ? "Aptitude"
                            : question.getCategory());
            existingQuestion.setMarks(question.getMarks());
        } else {
            // Keep existing test, check if it's a 50-mark test
            if (oldTest != null && oldTest.getTotalMarks() != null && oldTest.getTotalMarks() == 50) {
                existingQuestion.setMarks(1);
            } else {
                existingQuestion.setMarks(question.getMarks());
            }
        }

        Question saved = questionRepository.save(existingQuestion);
        // Update counts for both old and new test if changed
        if (oldTest != null && !oldTest.getId().equals(existingQuestion.getTest()?.getId())) {
            updateTestQuestionCount(oldTest);
        }
        updateTestQuestionCount(existingQuestion.getTest());
        return saved;
    }

    private String categoryLabel(TestCategory category) {
        return switch (category) {
            case APTITUDE -> "Aptitude";
            case CODING -> "Coding";
            case INTERVIEW_PREPARATION -> "Interview";
        };
    }

    private void ensureTestQuestionsCanBeModified(Test test) {
        if (Boolean.TRUE.equals(test.getIsPublished())) {
            throw new IllegalStateException(
                    "Questions cannot be changed after the test is published.");
        }
    }

    // Delete a question by ID
    @Override
    public void deleteQuestion(Integer id) {
        Question question = getQuestionById(id);
        Test test = question.getTest();
        if (test != null) {
            ensureTestQuestionsCanBeModified(test);
        }
        questionRepository.delete(question);
        updateTestQuestionCount(test);
    }

    // Bulk import questions
    @Override
    @Transactional
    public List<Question> bulkImportQuestions(BulkQuestionImportDto bulkImportDto) {
        List<Question> importedQuestions = new java.util.ArrayList<>();
        Test test = null;

        for (QuestionImportDto dto : bulkImportDto.getQuestions()) {
            Question question = new Question();
            question.setQuestionText(dto.getQuestionText());
            question.setCategory(dto.getCategory());
            question.setOptionA(dto.getOptionA());
            question.setOptionB(dto.getOptionB());
            question.setOptionC(dto.getOptionC());
            question.setOptionD(dto.getOptionD());
            question.setCorrectAnswer(dto.getCorrectAnswer());
            question.setExplanation(dto.getExplanation());
            question.setMarks(dto.getMarks());

            // Set test relationship if testId is provided
            if (dto.getTestId() != null && !dto.getTestId().isEmpty()) {
                if (test == null || !test.getId().equals(dto.getTestId())) {
                    test = testRepository.findById(dto.getTestId())
                            .orElseThrow(() -> new RuntimeException("Test not found with ID: " + dto.getTestId()));
                }
                ensureTestQuestionsCanBeModified(test);
                question.setTest(test);
                question.setCategory(categoryLabel(test.getCategory()));

                // For 50-mark tests, force 1 mark per question
                if (test.getTotalMarks() != null && test.getTotalMarks() == 50) {
                    question.setMarks(1);
                } else {
                    // Use test's marksPerQuestion as default if question marks not set
                    if (question.getMarks() == null || question.getMarks() == 0) {
                        question.setMarks(test.getMarksPerQuestion() != null ? test.getMarksPerQuestion() : 1);
                    }
                }
            } else if (question.getCategory() == null || question.getCategory().isBlank()) {
                question.setCategory("Aptitude");
            }

            importedQuestions.add(questionRepository.save(question));
        }

        // Update question count for the test
        if (test != null) {
            updateTestQuestionCount(test);
        }

        return importedQuestions;
    }
}
