
package com.study.backend.services.impl;

import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.study.backend.dtos.UserRequestDto;
import com.study.backend.dtos.UpdateUserRequestDto;
import com.study.backend.dtos.UserResponseDto;
import com.study.backend.entities.User;
import com.study.backend.entities.Role;
import com.study.backend.repositories.UserRepository;
import com.study.backend.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // Injects the password encoder from SecurityConfig
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto register(UserRequestDto dto) {

        // Convert DTO data into a User entity
        User user = new User();

        // Set the user's full name and email
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail().trim().toLowerCase(Locale.ROOT));

        // Encode the password before saving it in the database
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Save the user in the database
        User savedUser = userRepository.save(user);

        // Convert the saved entity into a response DTO
        UserResponseDto response = new UserResponseDto();

        // Set the user details that should be returned to the frontend
        response.setId(savedUser.getId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());

        // Return the response without exposing the password
        return response;
    }

    @Override
    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.ROLE_STUDENT);
    }

    @Override
    public UserResponseDto updateStudent(String id, UpdateUserRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail().trim().toLowerCase(Locale.ROOT));

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User savedUser = userRepository.save(user);

        UserResponseDto response = new UserResponseDto();
        response.setId(savedUser.getId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());

        return response;
    }
}
