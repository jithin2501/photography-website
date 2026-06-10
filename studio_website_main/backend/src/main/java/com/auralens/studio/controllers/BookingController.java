package com.auralens.studio.controllers;

import com.auralens.studio.models.Booking;
import com.auralens.studio.repositories.ServicePackagePriceRepository;
import com.auralens.studio.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final ServicePackagePriceRepository priceRepository;

    @Value("${app.razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    public BookingController(BookingService bookingService, ServicePackagePriceRepository priceRepository) {
        this.bookingService = bookingService;
        this.priceRepository = priceRepository;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Name, Phone, Photoshoot Type, Photoshoot Date, Packages, Location Preference are required
        if (booking.getFullName() == null || booking.getFullName().trim().isEmpty() ||
            booking.getPhone() == null || booking.getPhone().trim().isEmpty() ||
            booking.getPhotoshootType() == null || booking.getPhotoshootType().trim().isEmpty() ||
            booking.getDate() == null || booking.getDate().trim().isEmpty() ||
            booking.getLocationPreference() == null || booking.getLocationPreference().trim().isEmpty() ||
            booking.getPackageName() == null || booking.getPackageName().trim().isEmpty()) {
            
            Map<String, String> err = new HashMap<>();
            err.put("error", "Name, Phone, Photoshoot Type, Photoshoot Date, Packages, and Location Preference are required fields.");
            return ResponseEntity.badRequest().body(err);
        }

        Booking savedBooking = bookingService.createBooking(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Booking requested successfully.");
        response.put("data", savedBooking);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Initiate payment order
    @PostMapping("/razorpay/order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Booking booking) {
        if (booking.getFullName() == null || booking.getFullName().trim().isEmpty() ||
            booking.getPhone() == null || booking.getPhone().trim().isEmpty() ||
            booking.getPhotoshootType() == null || booking.getPhotoshootType().trim().isEmpty() ||
            booking.getDate() == null || booking.getDate().trim().isEmpty() ||
            booking.getLocationPreference() == null || booking.getLocationPreference().trim().isEmpty() ||
            booking.getPackageName() == null || booking.getPackageName().trim().isEmpty()) {
            
            Map<String, String> err = new HashMap<>();
            err.put("error", "Required fields are missing.");
            return ResponseEntity.badRequest().body(err);
        }

        try {
            Map<String, Object> orderDetails = bookingService.initiateBookingPayment(
                booking, 
                razorpayKeyId, 
                razorpayKeySecret, 
                priceRepository
            );
            orderDetails.put("keyId", razorpayKeyId); // Send public key to frontend
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to initiate payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // Verify signature
    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String paymentId = payload.get("razorpayPaymentId");
        String orderId = payload.get("razorpayOrderId");
        String signature = payload.get("razorpaySignature");
        String bookingId = payload.get("bookingId");

        if (paymentId == null || orderId == null || bookingId == null ||
            (signature == null && !orderId.startsWith("order_mock_"))) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Missing parameter details for validation.");
            return ResponseEntity.badRequest().body(err);
        }

        boolean verified = bookingService.verifyPaymentSignature(paymentId, orderId, signature, razorpayKeySecret);

        if (verified) {
            String method = bookingService.fetchPaymentMethod(paymentId, razorpayKeyId, razorpayKeySecret);
            Booking confirmed = bookingService.confirmPaidBooking(bookingId, paymentId, method);

            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Payment verified and booking confirmed successfully.");
            res.put("data", confirmed);
            return ResponseEntity.ok(res);
        } else {
            bookingService.markBookingFailed(bookingId);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid payment signature verification.");
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(err);
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getBookings() {
        List<Booking> bookings = bookingService.getAllBookings();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bookings);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable @NonNull String id) {
        boolean deleted = bookingService.deleteBooking(id);

        if (!deleted) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Booking deleted successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<?> getClientBooking(@PathVariable @NonNull String id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", booking);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/{id}/images")
    public ResponseEntity<?> updateClientImages(@PathVariable @NonNull String id, @RequestBody List<Booking.ClientImage> clientImages) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        booking.setClientImages(clientImages);
        Booking saved = bookingService.updateBooking(booking);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/client/{id}/images")
    public ResponseEntity<?> updateClientImagesByClient(@PathVariable @NonNull String id, @RequestBody List<Booking.ClientImage> clientImages) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        booking.setClientImages(clientImages);
        Booking saved = bookingService.updateBooking(booking);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }
}
