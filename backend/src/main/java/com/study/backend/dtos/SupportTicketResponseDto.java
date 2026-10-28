package com.study.backend.dtos;

import java.time.LocalDateTime;

import com.study.backend.entities.SupportTicket;

import lombok.Data;

@Data
public class SupportTicketResponseDto {

    private final String id;
    private final String studentName;
    private final String studentEmail;
    private final String testName;
    private final String category;
    private final String subject;
    private final String description;
    private final String status;
    private final LocalDateTime createdAt;

    public SupportTicketResponseDto(SupportTicket ticket) {
        this.id = ticket.getId();
        this.studentName = ticket.getUser().getFullName();
        this.studentEmail = ticket.getUser().getEmail();
        this.testName = ticket.getTest() == null ? null : ticket.getTest().getTitle();
        this.category = ticket.getCategory().name();
        this.subject = ticket.getSubject();
        this.description = ticket.getDescription();
        this.status = ticket.getStatus().name();
        this.createdAt = ticket.getCreatedAt();
    }
}
