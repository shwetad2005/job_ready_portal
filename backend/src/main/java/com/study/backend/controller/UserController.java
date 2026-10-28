//
//package com.study.backend.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.study.backend.dtos.UserRequestDto;
//import com.study.backend.dtos.UserResponseDto;
//import com.study.backend.services.UserService;
//
//import jakarta.validation.Valid;
//
//@RestController // This class handles API requests
//@RequestMapping("/users") // Common URL for user APIs
//public class UserController {
//	
//
//    @Autowired
//    private UserService userService; // Calls service logic
//
//    // POST - http://localhost:8080/users
//    // Register a new student
//    @PostMapping
//    public ResponseEntity<UserResponseDto> register(
//           @Valid @RequestBody UserRequestDto userRequestDto) {
//
//        // Send user data to service
////        UserResponseDto responseDto = UserService.register(userRequestDto);
//    	UserResponseDto responseDto = 
//    			userService.register(userRequestDto);
//
//        // Return response with status 201 Created
//        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);    // 201
//    }
//    
//    
//    
//}
//
//
//
//



package com.study.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.backend.dtos.UpdateUserRequestDto;
import com.study.backend.dtos.UserRequestDto;
import com.study.backend.dtos.UserResponseDto;
import com.study.backend.entities.User;
import com.study.backend.repositories.UserRepository;
import com.study.backend.services.UserService;

import jakarta.validation.Valid;

// Marks this class as a REST API controller
@RestController

// Sets the base URL for all endpoints in this controller
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    // Injects the UserService object automatically
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Handles POST requests to register a new user
    @PostMapping
    public ResponseEntity<UserResponseDto> register(

            // Reads the registration data from the request body
            // @Valid checks the validation annotations in UserRequestDto
            @Valid @RequestBody UserRequestDto userRequestDto) {

        // Calls the service layer to register the user
        UserResponseDto responseDto = userService.register(userRequestDto);

        // Returns the response with HTTP status 201 (Created)
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // Get all students (users with ROLE_STUDENT)
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Update a student by ID
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateStudent(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequestDto userRequestDto) {
        UserResponseDto responseDto = userService.updateStudent(id, userRequestDto);
        return ResponseEntity.ok(responseDto);
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


//@RestController — handles REST API requests.
//@RequestMapping("/users") — sets the base URL.
//@PostMapping — handles a POST request for registration.
//@RequestBody — converts incoming JSON into a Java object.
//@Valid — triggers validation annotations in UserRequestDto.
//HttpStatus.CREATED — returns status 201 when registration succeeds.
