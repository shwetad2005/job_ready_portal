
package com.study.backend.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.study.backend.entities.User;
import com.study.backend.repositories.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // Inject the repository to access user data from the database
    @Autowired
    private UserRepository userRepository;

    // Find the user in the database using their email address
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Search for a user with the given email
        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        return user;
    }
}
