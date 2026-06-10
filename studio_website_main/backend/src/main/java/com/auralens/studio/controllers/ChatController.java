package com.auralens.studio.controllers;

import com.auralens.studio.models.ChatMessage;
import com.auralens.studio.repositories.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @GetMapping("/history/{clientId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String clientId) {
        List<ChatMessage> history = new java.util.ArrayList<>(
            chatMessageRepository.findChatHistory(clientId, "ADMIN")
        );
        history.sort((m1, m2) -> Long.compare(m1.getTimestamp(), m2.getTimestamp()));
        return ResponseEntity.ok(history);
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        message.setTimestamp(System.currentTimeMillis());
        message.setRead(false);
        ChatMessage saved = chatMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/unread-counts")
    public ResponseEntity<java.util.Map<String, Long>> getUnreadCounts() {
        List<ChatMessage> unreadMessages = chatMessageRepository.findByReceiverIdAndRead("ADMIN", false);
        java.util.Map<String, Long> counts = new java.util.HashMap<>();
        for (ChatMessage msg : unreadMessages) {
            String senderId = msg.getSenderId();
            counts.put(senderId, counts.getOrDefault(senderId, 0L) + 1L);
        }
        return ResponseEntity.ok(counts);
    }

    @PutMapping("/read/{clientId}")
    @SuppressWarnings("null")
    public ResponseEntity<?> markMessagesAsRead(@PathVariable String clientId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findBySenderIdAndReceiverIdAndRead(clientId, "ADMIN", false);
        for (ChatMessage msg : unreadMessages) {
            msg.setRead(true);
        }
        chatMessageRepository.saveAll(unreadMessages);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("updatedCount", unreadMessages.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count/client/{clientId}")
    public ResponseEntity<java.util.Map<String, Long>> getClientUnreadCount(@PathVariable String clientId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findBySenderIdAndReceiverIdAndRead("ADMIN", clientId, false);
        java.util.Map<String, Long> response = new java.util.HashMap<>();
        response.put("unreadCount", (long) unreadMessages.size());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/read/client/{clientId}")
    @SuppressWarnings("null")
    public ResponseEntity<?> markClientMessagesAsRead(@PathVariable String clientId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findBySenderIdAndReceiverIdAndRead("ADMIN", clientId, false);
        for (ChatMessage msg : unreadMessages) {
            msg.setRead(true);
        }
        chatMessageRepository.saveAll(unreadMessages);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("updatedCount", unreadMessages.size());
        return ResponseEntity.ok(response);
    }
}
