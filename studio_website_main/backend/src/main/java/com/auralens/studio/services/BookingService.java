package com.auralens.studio.services;

import com.auralens.studio.models.Booking;
import com.auralens.studio.models.ServicePackagePrice;
import com.auralens.studio.repositories.BookingRepository;
import com.auralens.studio.repositories.ServicePackagePriceRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final List<Booking> inMemoryFallback = new CopyOnWriteArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(@NonNull Booking booking) {
        if (useFallback) {
            booking.setId(UUID.randomUUID().toString());
            inMemoryFallback.add(0, booking);
            return booking;
        }
        try {
            return bookingRepository.save(booking);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory storage for bookings. Error: " + e.getMessage());
            useFallback = true;
            booking.setId(UUID.randomUUID().toString());
            inMemoryFallback.add(0, booking);
            return booking;
        }
    }

    public List<Booking> getAllBookings() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            return bookingRepository.findAllByOrderByCreatedAtDesc();
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory retrieval for bookings. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public boolean deleteBooking(@NonNull String id) {
        if (useFallback) {
            return inMemoryFallback.removeIf(b -> b.getId().equals(id));
        }
        try {
            Optional<Booking> booking = bookingRepository.findById(id);
            if (booking.isPresent()) {
                bookingRepository.deleteById(id);
                return true;
            }
            return inMemoryFallback.removeIf(b -> b.getId().equals(id));
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Performing delete booking in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback.removeIf(b -> b.getId().equals(id));
        }
    }

    // Dynamic price string parsing: "₹15,000" -> 15000
    private int parsePriceString(String priceStr) {
        if (priceStr == null) return 0;
        String cleanStr = priceStr.replaceAll("[^\\d]", "");
        try {
            return Integer.parseInt(cleanStr);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    // Razorpay Integration: 1. Initiate order creation
    public Map<String, Object> initiateBookingPayment(
            Booking booking, 
            String keyId, 
            String keySecret, 
            ServicePackagePriceRepository priceRepo) throws Exception {
        
        // 1. Fetch dynamic price from database
        String serviceId = booking.getPhotoshootType().toLowerCase();
        Optional<ServicePackagePrice> priceOpt = priceRepo.findById(serviceId);
        
        int priceAmount = 15000; // default fallback amount
        if (priceOpt.isPresent()) {
            ServicePackagePrice spp = priceOpt.get();
            String tier = booking.getPackageName().toLowerCase();
            String priceStr = spp.getBasicPrice();
            if ("standard".equals(tier)) {
                priceStr = spp.getStandardPrice();
            } else if ("premium".equals(tier)) {
                priceStr = spp.getPremiumPrice();
            }
            priceAmount = parsePriceString(priceStr);
        }

        // 2. Persist booking as pending
        booking.setPaymentStatus("pending");
        Booking savedBooking = createBooking(booking);

        // 3. Fallback check for offline in-memory mock operations
        if (useFallback || "rzp_test_placeholder".equals(keyId)) {
            Map<String, Object> mockRes = new HashMap<>();
            String mockOrderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 8);
            savedBooking.setRazorpayOrderId(mockOrderId);
            if (!useFallback) {
                bookingRepository.save(savedBooking);
            }
            mockRes.put("orderId", mockOrderId);
            mockRes.put("amount", priceAmount * 100);
            mockRes.put("currency", "INR");
            mockRes.put("bookingId", savedBooking.getId());
            mockRes.put("isMock", true);
            return mockRes;
        }

        // 4. Create Razorpay order
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", priceAmount * 100); // in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", savedBooking.getId());

        Order order = razorpay.orders.create(orderRequest);
        String orderId = order.get("id");

        // 5. Update order ID in booking database entry
        savedBooking.setRazorpayOrderId(orderId);
        if (!useFallback) {
            bookingRepository.save(savedBooking);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", orderId);
        res.put("amount", priceAmount * 100);
        res.put("currency", "INR");
        res.put("bookingId", savedBooking.getId());
        res.put("isMock", false);
        return res;
    }

    // Razorpay Integration: 2. Verify signature
    public boolean verifyPaymentSignature(String paymentId, String orderId, String signature, String keySecret) {
        try {
            if (orderId.startsWith("order_mock_")) {
                return true; // Auto-verify mock orders
            }
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            System.err.println("Razorpay signature verification failed: " + e.getMessage());
            return false;
        }
    }

    // Razorpay Integration: 3. Retrieve payment method
    public String fetchPaymentMethod(String paymentId, String keyId, String keySecret) {
        if (paymentId.startsWith("pay_mock_") || "rzp_test_placeholder".equals(keyId)) {
            return "card (mock)";
        }
        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);
            return payment.get("method");
        } catch (Exception e) {
            System.err.println("Failed to fetch payment method details: " + e.getMessage());
            return "unknown";
        }
    }

    // Save/update paid bookings
    public Booking confirmPaidBooking(String bookingId, String paymentId, String paymentMethod) {
        if (bookingId == null) return null;
        if (useFallback) {
            for (Booking b : inMemoryFallback) {
                if (b.getId().equals(bookingId)) {
                    b.setPaymentStatus("paid");
                    b.setPaymentId(paymentId);
                    b.setPaymentMethod(paymentMethod);
                    return b;
                }
            }
            return null;
        }
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setPaymentStatus("paid");
                booking.setPaymentId(paymentId);
                booking.setPaymentMethod(paymentMethod);
                return bookingRepository.save(booking);
            }
            return null;
        } catch (Exception e) {
            System.err.println("Error saving paid status: " + e.getMessage());
            return null;
        }
    }

    // Mark booking as failed
    public void markBookingFailed(String bookingId) {
        if (bookingId == null) return;
        if (useFallback) {
            for (Booking b : inMemoryFallback) {
                if (b.getId().equals(bookingId)) {
                    b.setPaymentStatus("failed");
                }
            }
            return;
        }
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setPaymentStatus("failed");
                bookingRepository.save(booking);
            }
        } catch (Exception e) {
            System.err.println("Error saving failed status: " + e.getMessage());
        }
    }
}
