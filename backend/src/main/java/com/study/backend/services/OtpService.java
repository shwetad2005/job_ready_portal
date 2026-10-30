package com.study.backend.services;

public interface OtpService {
    String generateOtp(String email);
    boolean verifyOtp(String email, String otp);
}
