package com.auralens.studio.repositories;

import com.auralens.studio.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();
}
