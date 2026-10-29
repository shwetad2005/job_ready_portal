package com.study.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStudentResponseDto {
    private String id;
    private String fullName;
    private String email;
    private int attempts;
    private int bestScore;
}
