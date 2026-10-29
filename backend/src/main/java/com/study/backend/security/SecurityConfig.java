
package com.study.backend.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter  jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Creates a password encoder that securely hashes passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
            JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration =
                new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    // Configures security rules for all API endpoints
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            AuthenticationProvider authenticationProvider) throws Exception {

        httpSecurity
            .cors(Customizer.withDefaults())
            // Disables CSRF for this stateless REST API
            .csrf(csrf -> csrf.disable())

            // Does not create HTTP sessions; authentication will use JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            // Defines which endpoints are public and which require authentication
            .authorizeHttpRequests(request -> request
                .requestMatchers(HttpMethod.POST, "/users/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/students").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/users/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/attempts").authenticated()
                .requestMatchers(HttpMethod.GET, "/attempts/mine").authenticated()
                .requestMatchers(HttpMethod.GET, "/attempts").authenticated()
                .requestMatchers(HttpMethod.GET, "/attempts/leaderboard").authenticated()
                .requestMatchers(HttpMethod.GET, "/attempts/leaderboard/category").authenticated()
                .requestMatchers(HttpMethod.GET, "/attempts/leaderboard/category/rank").authenticated()
                .requestMatchers(HttpMethod.POST, "/tickets").authenticated()
                .requestMatchers(HttpMethod.GET, "/tickets/mine").authenticated()
                .requestMatchers(HttpMethod.GET, "/tickets").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/tickets/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/courses").permitAll()
                .requestMatchers(HttpMethod.POST, "/courses").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/courses/mine").authenticated()
                .requestMatchers(HttpMethod.GET, "/courses/*/learn").authenticated()
                .requestMatchers(HttpMethod.GET, "/courses/*/material").authenticated()
                .requestMatchers(HttpMethod.POST, "/courses/*/enroll").authenticated()
                .requestMatchers(HttpMethod.POST, "/courses/*/complete").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/courses/*/enrollment").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/courses/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/tests/**").hasRole("ADMIN")
                .requestMatchers("/questions/**").permitAll()
                .requestMatchers("/tests/**").permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return httpSecurity.build();
    }
}
