package com.auralens.studio.controllers;

import com.auralens.studio.models.Review;
import com.auralens.studio.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Public endpoint: get approved reviews for frontend
    @GetMapping
    public ResponseEntity<Map<String, Object>> getApprovedReviews() {
        List<Review> reviews = reviewService.getApprovedReviews();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", reviews);
        return ResponseEntity.ok(response);
    }

    // Public endpoint: submit new review
    @PostMapping
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody Review newReview) {
        if (newReview.getName() == null || newReview.getName().trim().isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("error", "Name is required.");
            return ResponseEntity.badRequest().body(err);
        }

        if (newReview.getRating() < 1 || newReview.getRating() > 5) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("error", "Rating must be between 1 and 5 stars.");
            return ResponseEntity.badRequest().body(err);
        }

        if (newReview.getMessage() == null || newReview.getMessage().trim().isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("error", "Review message is required.");
            return ResponseEntity.badRequest().body(err);
        }

        Review saved = reviewService.addReview(newReview);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    // Admin endpoint: get all reviews
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", reviews);
        return ResponseEntity.ok(response);
    }

    // Admin endpoint: update status of a review
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Map<String, Object>> updateReviewStatus(
            @PathVariable("id") @NonNull String id,
            @RequestBody Map<String, String> body) {
        
        String status = body.get("status");
        if (status == null || (!status.equals("APPROVED") && !status.equals("DISAPPROVED") && !status.equals("PENDING"))) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("error", "Invalid or missing status. Must be APPROVED, DISAPPROVED or PENDING.");
            return ResponseEntity.badRequest().body(err);
        }

        Review result = reviewService.updateReviewStatus(id, status);
        if (result == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("status", "error");
            err.put("error", "Review not found.");
            return ResponseEntity.status(404).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    // Admin endpoint: delete a review
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable("id") @NonNull String id) {
        reviewService.deleteReview(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Review deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
