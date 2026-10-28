package com.study.backend.dtos;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestAttemptRequestDto {

    @NotBlank
    private String testId;

    @NotNull
    private List<@Valid SubmittedAnswerDto> answers;
}
