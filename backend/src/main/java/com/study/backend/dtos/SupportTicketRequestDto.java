package com.study.backend.dtos;

import com.study.backend.entities.TicketCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketRequestDto {

    @NotNull
    private TicketCategory category;

    @NotBlank
    @Size(max = 150)
    private String subject;

    @NotBlank
    @Size(max = 5000)
    private String description;

    private String testId;
}
