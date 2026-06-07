package com.auralens.studio.services;

import com.auralens.studio.models.Booking;
import com.auralens.studio.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
