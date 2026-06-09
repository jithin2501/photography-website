package com.auralens.studio.services;

import com.auralens.studio.models.ClientUser;
import com.auralens.studio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public ClientUser registerClient(ClientUser clientUser) {
        Optional<ClientUser> existingOpt = clientUserRepository.findByBookingId(clientUser.getBookingId());
        if (existingOpt.isPresent()) {
            ClientUser existing = existingOpt.get();
            existing.setUsername(clientUser.getUsername());
            existing.setPassword(clientUser.getPassword());
            existing.setFullName(clientUser.getFullName());
            existing.setPhone(clientUser.getPhone());
            // Preserve status and lastLogin if they exist
            return clientUserRepository.save(existing);
        }
        return clientUserRepository.save(clientUser);
    }

    public Map<String, Object> authenticateClient(String username, String password) {
        Optional<ClientUser> userOpt = clientUserRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            ClientUser user = userOpt.get();
            
            // Block if deactivated
            if ("DEACTIVATED".equalsIgnoreCase(user.getStatus())) {
                return null;
            }

            // Update last login
            user.setLastLogin(System.currentTimeMillis());
            clientUserRepository.save(user);

            String token = tokenProvider.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("fullName", user.getFullName());
            response.put("bookingId", user.getBookingId());
            return response;
        }
        return null;
    }

    public Optional<ClientUser> getClientByBookingId(String bookingId) {
        return clientUserRepository.findByBookingId(bookingId);
    }

    // Admin APIs for Client Users
    public List<ClientUser> getAllClientUsers() {
        return clientUserRepository.findAll();
    }

    public Optional<ClientUser> updateClientStatus(String id, String status) {
        Optional<ClientUser> userOpt = clientUserRepository.findById(id);
        if (userOpt.isPresent()) {
            ClientUser user = userOpt.get();
            user.setStatus(status);
            return Optional.of(clientUserRepository.save(user));
        }
        return Optional.empty();
    }

    public void deleteClientUser(String id) {
        clientUserRepository.deleteById(id);
    }
}
