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
    private final com.auralens.studio.repositories.ClientUserRepository clientUserRepository;

    @Autowired
    public AuthService(JwtTokenProvider tokenProvider, com.auralens.studio.repositories.ClientUserRepository clientUserRepository) {
        this.tokenProvider = tokenProvider;
        this.clientUserRepository = clientUserRepository;
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

    public com.auralens.studio.models.ClientUser registerClient(com.auralens.studio.models.ClientUser clientUser) {
        java.util.Optional<com.auralens.studio.models.ClientUser> existingOpt = clientUserRepository.findByBookingId(clientUser.getBookingId());
        if (existingOpt.isPresent()) {
            com.auralens.studio.models.ClientUser existing = existingOpt.get();
            existing.setUsername(clientUser.getUsername());
            existing.setPassword(clientUser.getPassword());
            existing.setFullName(clientUser.getFullName());
            existing.setPhone(clientUser.getPhone());
            return clientUserRepository.save(existing);
        }
        return clientUserRepository.save(clientUser);
    }

    public Map<String, Object> authenticateClient(String username, String password) {
        java.util.Optional<com.auralens.studio.models.ClientUser> userOpt = clientUserRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            String token = tokenProvider.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("fullName", userOpt.get().getFullName());
            response.put("bookingId", userOpt.get().getBookingId());
            return response;
        }
        return null;
    }

    public java.util.Optional<com.auralens.studio.models.ClientUser> getClientByBookingId(String bookingId) {
        return clientUserRepository.findByBookingId(bookingId);
    }
}
