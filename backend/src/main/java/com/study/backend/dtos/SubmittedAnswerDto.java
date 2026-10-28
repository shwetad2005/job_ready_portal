package com.study.backend.dtos;

import lombok.Data;

@Data
public class SubmittedAnswerDto {

    private Integer questionId;
    private String selectedAnswer;
}
