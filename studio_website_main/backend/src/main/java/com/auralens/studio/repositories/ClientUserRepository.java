package com.auralens.studio.repositories;

import com.auralens.studio.models.ClientUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientUserRepository extends MongoRepository<ClientUser, String> {
    Optional<ClientUser> findByUsername(String username);
    Optional<ClientUser> findByBookingId(String bookingId);
}
