package com.auralens.studio.services;

import com.auralens.studio.models.Review;
import com.auralens.studio.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final List<Review> inMemoryFallback = new ArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @PostConstruct
    public void init() {
        // Prepare in-memory fallback reviews
        Review r1 = new Review("Ananya & Rohan", 5, "Absolutely magical! They captured every little emotion beautifully. We couldn't have asked for more.", System.currentTimeMillis() - 3000);
        r1.setId("fallback-review-1");
        r1.setStatus("APPROVED");
        inMemoryFallback.add(r1);

        Review r2 = new Review("Meera & Arjun", 5, "The team is incredibly talented! Professional, patient, and they made us feel so comfortable.", System.currentTimeMillis() - 2000);
        r2.setId("fallback-review-2");
        r2.setStatus("APPROVED");
        inMemoryFallback.add(r2);

        Review r3 = new Review("Sneha & Kabir", 5, "Stunning photos! The quality and attention to detail are top-notch. Highly recommended!", System.currentTimeMillis() - 1000);
        r3.setId("fallback-review-3");
        r3.setStatus("APPROVED");
        inMemoryFallback.add(r3);

        try {
            long count = reviewRepository.count();
            if (count == 0) {
                List<Review> defaultReviews = new ArrayList<>();
                defaultReviews.add(new Review("Ananya & Rohan", 5, "Absolutely magical! They captured every little emotion beautifully. We couldn't have asked for more.", System.currentTimeMillis() - 3000));
                defaultReviews.add(new Review("Meera & Arjun", 5, "The team is incredibly talented! Professional, patient, and they made us feel so comfortable.", System.currentTimeMillis() - 2000));
                defaultReviews.add(new Review("Sneha & Kabir", 5, "Stunning photos! The quality and attention to detail are top-notch. Highly recommended!", System.currentTimeMillis() - 1000));
                for (Review r : defaultReviews) {
                    r.setStatus("APPROVED");
                }
                reviewRepository.saveAll(defaultReviews);
                System.out.println("Initialized MongoDB with default reviews.");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize MongoDB reviews. Using in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
        }
    }

    public List<Review> getApprovedReviews() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            List<Review> reviews = reviewRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
            if (reviews.isEmpty()) {
                return inMemoryFallback;
            }
            return reviews;
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory reviews. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public List<Review> getAllReviews() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            return reviewRepository.findAllByOrderByCreatedAtDesc();
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory reviews. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public Review addReview(@NonNull Review review) {
        if (review.getCreatedAt() == 0) {
            review.setCreatedAt(System.currentTimeMillis());
        }
        review.setStatus("PENDING"); // Force PENDING on creation

        if (useFallback) {
            review.setId("fallback-review-id-" + (inMemoryFallback.size() + 1));
            inMemoryFallback.add(0, review);
            return review;
        }
        try {
            return reviewRepository.save(review);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during save! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            review.setId("fallback-review-id-" + (inMemoryFallback.size() + 1));
            inMemoryFallback.add(0, review);
            return review;
        }
    }

    public Review updateReviewStatus(@NonNull String id, @NonNull String status) {
        if (useFallback) {
            for (Review r : inMemoryFallback) {
                if (id.equals(r.getId())) {
                    r.setStatus(status);
                    return r;
                }
            }
            return null;
        }
        try {
            Optional<Review> opt = reviewRepository.findById(id);
            if (opt.isPresent()) {
                Review r = opt.get();
                r.setStatus(status);
                return reviewRepository.save(r);
            }
            return null;
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during status update! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            for (Review r : inMemoryFallback) {
                if (id.equals(r.getId())) {
                    r.setStatus(status);
                    return r;
                }
            }
            return null;
        }
    }

    public void deleteReview(@NonNull String id) {
        if (useFallback) {
            inMemoryFallback.removeIf(r -> id.equals(r.getId()));
            return;
        }
        try {
            reviewRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during delete! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            inMemoryFallback.removeIf(r -> id.equals(r.getId()));
        }
    }
}
