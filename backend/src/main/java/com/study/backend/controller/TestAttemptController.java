
package com.study.backend.controller;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.backend.dtos.AttemptAnswerResponseDto;
import com.study.backend.dtos.SubmittedAnswerDto;
import com.study.backend.dtos.TestAttemptRequestDto;
import com.study.backend.dtos.TestAttemptResponseDto;
import com.study.backend.entities.Question;
import com.study.backend.entities.StudentAnswer;
import com.study.backend.entities.Test;
import com.study.backend.entities.TestAttempt;
import com.study.backend.entities.User;
import com.study.backend.repositories.QuestionRepository;
import com.study.backend.repositories.TestAttemptRepository;
import com.study.backend.repositories.TestRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/attempts")
public class TestAttemptController {

    private final TestAttemptRepository attemptRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public TestAttemptController(
            TestAttemptRepository attemptRepository,
            TestRepository testRepository,
            QuestionRepository questionRepository) {

        this.attemptRepository = attemptRepository;
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    // Submit test attempt
    @PostMapping
    public ResponseEntity<TestAttemptResponseDto> submitAttempt(
            @Valid @RequestBody TestAttemptRequestDto request,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Test test = testRepository.findById(request.getTestId())
                .orElse(null);

        if (test == null
                || !Boolean.TRUE.equals(test.getIsPublished())
                || !Boolean.TRUE.equals(test.getIsActive())) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Convert submitted answers into a map
        Map<Integer, String> answers = request.getAnswers().stream()
                .filter(answer -> answer.getQuestionId() != null
                        && answer.getSelectedAnswer() != null)
                .collect(Collectors.toMap(
                        SubmittedAnswerDto::getQuestionId,
                        SubmittedAnswerDto::getSelectedAnswer,
                        (first, duplicate) -> duplicate));

        // Get questions belonging to this test
        List<Question> questions =
                questionRepository.findByTestId(test.getId());

        int score = 0;
        int total = 0;

        // Calculate total marks and score
        for (Question question : questions) {

            int marks = question.getMarks() == null
                    ? 0
                    : question.getMarks();

            total += marks;

            if (question.getId() != null
                    && question.getCorrectAnswer() != null
                    && question.getCorrectAnswer().equals(
                            answers.get(question.getId()))) {

                score += marks;
            }
        }

        // Create attempt record
        TestAttempt attempt = new TestAttempt();

        attempt.setUser(user);
        attempt.setTest(test);
        attempt.setScore(score);
        attempt.setTotalMarks(total);

        // Calculate time taken in seconds
        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = LocalDateTime.now();

        int timeTakenSeconds = 0;

        if (startTime != null && !startTime.isAfter(endTime)) {
            timeTakenSeconds = (int) Math.min(
                    Duration.between(startTime, endTime).getSeconds(),
                    Integer.MAX_VALUE);
        }

        attempt.setTimeTakenSeconds(timeTakenSeconds);

        // Save each submitted answer
        for (Question question : questions) {

            String selectedAnswer = question.getId() == null
                    ? null
                    : answers.get(question.getId());

            int marks = question.getMarks() == null
                    ? 0
                    : question.getMarks();

            StudentAnswer submittedAnswer = new StudentAnswer();

            submittedAnswer.setTestAttempt(attempt);
            submittedAnswer.setQuestion(question);
            submittedAnswer.setSelectedAnswer(selectedAnswer);

            boolean correct = question.getCorrectAnswer() != null
                    && question.getCorrectAnswer().equals(selectedAnswer);

            submittedAnswer.setCorrect(correct);
            submittedAnswer.setMarksObtained(correct ? marks : 0);

            attempt.getAnswers().add(submittedAnswer);
        }

        TestAttempt savedAttempt = attemptRepository.save(attempt);

        return ResponseEntity.ok(toResponse(savedAttempt, false));
    }

    // Get all attempts with answer details
    @GetMapping
    public ResponseEntity<List<TestAttemptResponseDto>> getAllAttempts() {

        List<TestAttemptResponseDto> attempts =
                attemptRepository.findAllByOrderByAttemptedAtDesc()
                        .stream()
                        .map(attempt -> toResponse(attempt, true))
                        .toList();

        return ResponseEntity.ok(attempts);
    }

    // Get logged-in user's attempts
    @GetMapping("/mine")
    public ResponseEntity<List<TestAttemptResponseDto>> getMyAttempts(
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TestAttemptResponseDto> attempts =
                attemptRepository
                        .findByUser_IdOrderByAttemptedAtDesc(user.getId())
                        .stream()
                        .map(attempt -> toResponse(attempt, false))
                        .toList();

        return ResponseEntity.ok(attempts);
    }

    // Get leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<TestAttemptResponseDto>> getLeaderboard() {

        List<TestAttemptResponseDto> leaderboard =
                attemptRepository.findAll()
                        .stream()
                        .map(attempt -> toResponse(attempt, false))
                        .sorted((a, b) -> {

                            // Primary: highest percentage first
                            int scoreCompare = Integer.compare(
                                    b.getPercentage(),
                                    a.getPercentage());

                            if (scoreCompare != 0) {
                                return scoreCompare;
                            }

                            // Secondary: less time taken first
                            int timeCompare = Integer.compare(
                                    a.getTimeTakenSeconds(),
                                    b.getTimeTakenSeconds());

                            if (timeCompare != 0) {
                                return timeCompare;
                            }

                            // Tertiary: earlier submission first
                            if (a.getAttemptedAt() == null) {
                                return b.getAttemptedAt() == null
                                        ? 0 : 1;
                            }

                            if (b.getAttemptedAt() == null) {
                                return -1;
                            }

                            return a.getAttemptedAt()
                                    .compareTo(b.getAttemptedAt());
                        })
                        .toList();

        return ResponseEntity.ok(leaderboard);
    }

    // Convert entity into response DTO
    private TestAttemptResponseDto toResponse(
            TestAttempt attempt,
            boolean includeAnswerDetails) {

        User user = attempt.getUser();
        Test test = attempt.getTest();

        int total = attempt.getTotalMarks() == null
                ? 0
                : attempt.getTotalMarks();

        int score = attempt.getScore() == null
                ? 0
                : attempt.getScore();

        int percentage = total <= 0
                ? 0
                : Math.round(score * 100f / total);

        return new TestAttemptResponseDto(
                attempt.getId(),
                user.getFullName(),
                user.getEmail(),
                test.getId(),
                test.getCategory().name(),
                test.getTitle(),
                score,
                total,
                percentage,
                attempt.getAttemptedAt(),
                attempt.getTimeTakenSeconds(),
                includeAnswerDetails
                        ? attempt.getAnswers()
                                .stream()
                                .map(this::toAnswerResponse)
                                .toList()
                        : List.of());
    }

    // Convert answer entity into answer response DTO
    private AttemptAnswerResponseDto toAnswerResponse(
            StudentAnswer answer) {

        Question question = answer.getQuestion();

        return new AttemptAnswerResponseDto(
                question.getId(),
                question.getQuestionText(),
                answer.getSelectedAnswer(),
                question.getCorrectAnswer(),
                answer.getCorrect(),
                answer.getMarksObtained(),
                question.getMarks(),
                question.getExplanation());
    }
}
