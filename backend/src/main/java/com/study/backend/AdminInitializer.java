package com.study.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.study.backend.entities.Role;
import com.study.backend.entities.User;
import com.study.backend.repositories.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository) {
        return args -> {

            // Check whether the admin account already exists
            String adminEmail = "admin@jobready.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                // Create a new admin account
                User admin = new User();
                admin.setFullName("JobReady Admin");
                admin.setEmail(adminEmail);

                // Encode the password before saving it
                PasswordEncoder encoder = new BCryptPasswordEncoder();
                admin.setPassword(encoder.encode("ChangeMe@123"));

                // Assign the ADMIN role
                admin.setRole(Role.ROLE_ADMIN);
                

                // Save the admin account in the database
                userRepository.save(admin);
            }
        };
    }
}
