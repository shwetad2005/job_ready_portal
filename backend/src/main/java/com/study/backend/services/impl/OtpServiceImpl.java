package com.study.backend.services.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.study.backend.services.OtpService;

@Service
public class OtpServiceImpl implements OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Long> otpExpiry = new HashMap<>();
    private static final long OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

    @Override
    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStorage.put(email.toLowerCase(), otp);
        otpExpiry.put(email.toLowerCase(), System.currentTimeMillis() + OTP_VALIDITY_MS);
        
        // In production, send email via SMTP
        System.out.println("OTP for " + email + ": " + otp);
        
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email.toLowerCase());
        Long expiry = otpExpiry.get(email.toLowerCase());
        
        if (storedOtp == null || expiry == null) {
            return false;
        }
        
        if (System.currentTimeMillis() > expiry) {
            otpStorage.remove(email.toLowerCase());
            otpExpiry.remove(email.toLowerCase());
            return false;
        }
        
        return storedOtp.equals(otp);
    }
}
