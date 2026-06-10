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
}
