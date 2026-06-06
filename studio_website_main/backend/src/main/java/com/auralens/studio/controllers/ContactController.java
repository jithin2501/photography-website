package com.auralens.studio.controllers;

import com.auralens.studio.models.Contact;
import com.auralens.studio.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody Contact contact) {
        if (contact.getName() == null || contact.getEmail() == null ||
            contact.getSubject() == null || contact.getMessage() == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Name, email, subject, and message are required");
            return ResponseEntity.badRequest().body(err);
        }

        Contact savedContact = contactService.createContactMessage(contact);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Message sent successfully");
        response.put("data", savedContact);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/messages")
    public ResponseEntity<?> getMessages() {
        List<Contact> messages = contactService.getAllContactMessages();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", messages);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/messages/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable @NonNull String id) {
        boolean deleted = contactService.deleteContactMessage(id);

        if (!deleted) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Message not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Message deleted successfully");

        return ResponseEntity.ok(response);
    }
}
