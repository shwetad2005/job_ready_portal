package com.study.backend.dtos;

import com.study.backend.entities.TicketStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SupportTicketStatusDto {

    @NotNull
    private TicketStatus status;
}
