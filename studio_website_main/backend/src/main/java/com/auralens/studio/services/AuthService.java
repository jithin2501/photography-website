package com.auralens.studio.services;

import com.auralens.studio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    public Map<String, String> authenticateAdmin(String username, String password) {
        if (username.equals(adminUsername) && password.equals(adminPassword)) {
            String token = tokenProvider.generateToken(username);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            return response;
        }
        return null;
    }
}
