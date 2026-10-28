package com.study.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.backend.dtos.SupportTicketRequestDto;
import com.study.backend.dtos.SupportTicketResponseDto;
import com.study.backend.dtos.SupportTicketStatusDto;
import com.study.backend.entities.SupportTicket;
import com.study.backend.entities.TicketStatus;
import com.study.backend.entities.User;
import com.study.backend.repositories.SupportTicketRepository;
import com.study.backend.repositories.TestAttemptRepository;
import com.study.backend.repositories.TestRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tickets")
public class SupportTicketController {

    private final SupportTicketRepository ticketRepository;
    private final TestRepository testRepository;
    private final TestAttemptRepository attemptRepository;

    public SupportTicketController(
            SupportTicketRepository ticketRepository,
            TestRepository testRepository,
            TestAttemptRepository attemptRepository) {
        this.ticketRepository = ticketRepository;
        this.testRepository = testRepository;
        this.attemptRepository = attemptRepository;
    }

    @PostMapping
    public ResponseEntity<SupportTicketResponseDto> createTicket(
            @Valid @RequestBody SupportTicketRequestDto request,
            @AuthenticationPrincipal User user) {
        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setCategory(request.getCategory());
        ticket.setSubject(request.getSubject().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setStatus(TicketStatus.OPEN);

        if (request.getTestId() != null && !request.getTestId().isBlank()) {
            var test = testRepository.findById(request.getTestId()).orElse(null);
            if (test == null
                    || !attemptRepository.existsByUser_IdAndTest_Id(user.getId(), test.getId())) {
                return ResponseEntity.badRequest().build();
            }
            ticket.setTest(test);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SupportTicketResponseDto(ticketRepository.save(ticket)));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SupportTicketResponseDto>> getMyTickets(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketRepository
                .findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(SupportTicketResponseDto::new)
                .toList());
    }

    @GetMapping
    public ResponseEntity<List<SupportTicketResponseDto>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SupportTicketResponseDto::new)
                .toList());
    }

    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<SupportTicketResponseDto> updateStatus(
            @PathVariable String ticketId,
            @Valid @RequestBody SupportTicketStatusDto request) {
        return ticketRepository.findById(ticketId)
                .map(ticket -> {
                    ticket.setStatus(request.getStatus());
                    return ResponseEntity.ok(
                            new SupportTicketResponseDto(ticketRepository.save(ticket)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
