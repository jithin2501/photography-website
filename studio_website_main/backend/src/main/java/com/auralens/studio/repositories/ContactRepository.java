package com.auralens.studio.repositories;

import com.auralens.studio.models.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findAllByOrderByCreatedAtDesc();
}
