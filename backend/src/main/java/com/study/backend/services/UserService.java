
package com.study.backend.services;

import java.util.List;

// Import DTO classes used for registration request and response
import com.study.backend.dtos.UserRequestDto;
import com.study.backend.dtos.UpdateUserRequestDto;
import com.study.backend.dtos.UserResponseDto;
import com.study.backend.entities.User;
import com.study.backend.dtos.AdminStudentResponseDto;

// Defines the methods that the UserService implementation must provide
public interface UserService {

    // Registers a new user using the details received from the frontend
    // Accepts user details through UserRequestDto
    // Returns the registered user's information through UserResponseDto
    UserResponseDto register(UserRequestDto userRequestDto);

    // Gets all users with ROLE_STUDENT
    List<AdminStudentResponseDto> getAllStudents();

    // Updates an existing student
    UserResponseDto updateStudent(String id, UpdateUserRequestDto userRequestDto);

    boolean deleteStudent(String id);

}
