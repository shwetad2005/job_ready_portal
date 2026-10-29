package com.study.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.study.backend.entities.SupportTicket;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {

    @Override
    @EntityGraph(attributePaths = {"user", "test"})
    Optional<SupportTicket> findById(String id);

    @EntityGraph(attributePaths = {"user", "test"})
    List<SupportTicket> findByUser_IdOrderByCreatedAtDesc(String userId);

    @EntityGraph(attributePaths = {"user", "test"})
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
    void deleteAllByUser_Id(String userId);
}
