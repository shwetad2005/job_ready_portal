package com.study.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.study.backend.services.QuestionService;
import com.study.backend.dtos.BulkQuestionImportDto;
import com.study.backend.entities.Question;
import com.study.backend.repositories.QuestionRepository;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionRepository questionRepository;

    // Create a new question
    @PostMapping
    public ResponseEntity<Question> createQuestion(
            @RequestBody Question question) {
        Question savedQuestion = questionService.createQuestion(question);
        return new ResponseEntity<>(savedQuestion, HttpStatus.CREATED);
    }

    // Bulk import questions
    @PostMapping("/bulk")
    public ResponseEntity<List<Question>> bulkImportQuestions(
            @RequestBody BulkQuestionImportDto bulkImportDto) {
        List<Question> importedQuestions = questionService.bulkImportQuestions(bulkImportDto);
        return new ResponseEntity<>(importedQuestions, HttpStatus.CREATED);
    }

    // Get all questions
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    // Get questions by test ID
    @GetMapping("/test/{testId}")
    public ResponseEntity<List<Question>> getQuestionsByTestId(
            @PathVariable String testId) {
        List<Question> questions = questionRepository.findByTestId(testId);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/reusable/test/{testId}")
    public ResponseEntity<List<Question>> getReusableQuestions(
            @PathVariable String testId) {
        return ResponseEntity.ok(questionService.getReusableQuestions(testId));
    }

    @PostMapping("/{questionId}/copy-to-test/{testId}")
    public ResponseEntity<Question> copyQuestionToTest(
            @PathVariable Integer questionId,
            @PathVariable String testId) {
        return new ResponseEntity<>(
                questionService.copyQuestionToTest(questionId, testId),
                HttpStatus.CREATED);
    }

    @PostMapping("/copy-to-test/{testId}")
    public ResponseEntity<List<Question>> copyQuestionsToTest(
            @PathVariable String testId,
            @RequestBody List<Integer> questionIds) {
        return new ResponseEntity<>(
                questionService.copyQuestionsToTest(questionIds, testId),
                HttpStatus.CREATED);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidQuestionReuse(
            IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handlePublishedTestQuestionChange(
            IllegalStateException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    // Get a question by ID
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    // Update a question
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Integer id,
            @RequestBody Question question) {
        return ResponseEntity.ok(
                questionService.updateQuestion(id, question));
    }

    // Delete a question
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Integer id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
