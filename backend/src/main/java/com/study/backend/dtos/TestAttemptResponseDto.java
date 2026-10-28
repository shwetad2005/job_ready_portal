package com.study.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TestAttemptResponseDto {

    private String id;
    private String name;
    private String email;
    private String testId;
    private String category;
    private String testName;
    private Integer score;
    private Integer total;
    private Integer percentage;
    private LocalDateTime attemptedAt;
    private List<AttemptAnswerResponseDto> answers;
}
