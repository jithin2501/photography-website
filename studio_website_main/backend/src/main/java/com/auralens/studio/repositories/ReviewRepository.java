package com.auralens.studio.repositories;

import com.auralens.studio.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByStatusOrderByCreatedAtDesc(String status);
}
