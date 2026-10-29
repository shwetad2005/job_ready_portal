package com.study.backend.dtos;

import com.study.backend.entities.TicketStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketStatusDto {

    @NotNull
    private TicketStatus status;

    @Size(max = 5000)
    private String adminReply;
}
