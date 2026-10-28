
package com.study.backend.dtos;

// Import Lombok annotations to reduce boilerplate code
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Generates getters, setters, toString(), equals(), and hashCode()
@Data

// Generates a constructor with parameters for all fields
@AllArgsConstructor

// Generates a default constructor without parameters
@NoArgsConstructor

// This DTO carries user information from the backend to the client
public class UserResponseDto {

    // Stores the registered user's ID
    private String Id;

    // Stores the registered user's full name
    private String fullName;

    // Stores the registered user's email address
    private String email;

    private String role;
}
