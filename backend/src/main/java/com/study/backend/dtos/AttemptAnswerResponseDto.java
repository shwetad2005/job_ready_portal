package com.study.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttemptAnswerResponseDto {

    private Integer questionId;
    private String questionText;
    private String selectedAnswer;
    private String correctAnswer;
    private Boolean correct;
    private Integer marksObtained;
    private Integer totalMarks;
    private String explanation;
}
