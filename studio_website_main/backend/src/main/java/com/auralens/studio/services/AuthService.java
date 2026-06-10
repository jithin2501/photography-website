package com.auralens.studio.services;

import com.auralens.studio.models.Booking;
import com.auralens.studio.models.ClientUser;
import com.auralens.studio.repositories.BookingRepository;
import com.auralens.studio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
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
    private final BookingRepository bookingRepository;

    @Autowired
    public AuthService(JwtTokenProvider tokenProvider, com.auralens.studio.repositories.ClientUserRepository clientUserRepository, BookingRepository bookingRepository) {
        this.tokenProvider = tokenProvider;
        this.clientUserRepository = clientUserRepository;
        this.bookingRepository = bookingRepository;
    }

    @jakarta.annotation.PostConstruct
    @SuppressWarnings("null")
    public void migrateClientIds() {
        try {
            List<ClientUser> users = clientUserRepository.findAll();
            boolean updatedAny = false;
            for (ClientUser user : users) {
                if (user.getClientId() == null && user.getBookingId() != null) {
                    Optional<Booking> bookingOpt = bookingRepository.findById(user.getBookingId());
                    if (bookingOpt.isPresent()) {
                        user.setClientId(bookingOpt.get().getClientId());
                        clientUserRepository.save(user);
                        updatedAny = true;
                    }
                }
            }
            if (updatedAny) {
                System.out.println("Migrated existing ClientUser records to include ClientID.");
            }
        } catch (Exception e) {
            System.err.println("Failed to run ClientID migration: " + e.getMessage());
        }
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
            existing.setClientId(clientUser.getClientId());
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

    public Optional<ClientUser> updateClientStatus(@NonNull String id, String status) {
        Optional<ClientUser> userOpt = clientUserRepository.findById(id);
        if (userOpt.isPresent()) {
            ClientUser user = userOpt.get();
            user.setStatus(status);
            return Optional.of(clientUserRepository.save(user));
        }
        return Optional.empty();
    }

    public void deleteClientUser(@NonNull String id) {
        clientUserRepository.deleteById(id);
    }
}
