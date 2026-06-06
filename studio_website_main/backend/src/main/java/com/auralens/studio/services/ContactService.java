package com.auralens.studio.services;

import com.auralens.studio.models.Contact;
import com.auralens.studio.repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final List<Contact> inMemoryFallback = new CopyOnWriteArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Contact createContactMessage(@NonNull Contact contact) {
        if (useFallback) {
            contact.setId(UUID.randomUUID().toString());
            inMemoryFallback.add(0, contact);
            return contact;
        }
        try {
            return contactRepository.save(contact);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory storage. Error: " + e.getMessage());
            useFallback = true;
            contact.setId(UUID.randomUUID().toString());
            inMemoryFallback.add(0, contact);
            return contact;
        }
    }

    public List<Contact> getAllContactMessages() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            return contactRepository.findAllByOrderByCreatedAtDesc();
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory retrieval. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public boolean deleteContactMessage(@NonNull String id) {
        if (useFallback) {
            return inMemoryFallback.removeIf(c -> c.getId().equals(id));
        }
        try {
            Optional<Contact> contact = contactRepository.findById(id);
            if (contact.isPresent()) {
                contactRepository.deleteById(id);
                return true;
            }
            return inMemoryFallback.removeIf(c -> c.getId().equals(id));
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Performing delete in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback.removeIf(c -> c.getId().equals(id));
        }
    }
}
