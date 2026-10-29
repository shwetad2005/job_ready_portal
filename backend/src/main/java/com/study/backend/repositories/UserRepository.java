package com.study.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.study.backend.entities.User;
import com.study.backend.entities.Role;

public interface UserRepository extends JpaRepository<User, String>{

	  // Check whether a user already exists with this email
    boolean existsByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "attempts")
    List<User> findByRole(Role role);

}
