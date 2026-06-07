package com.auralens.studio.repositories;

import com.auralens.studio.models.GalleryImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends MongoRepository<GalleryImage, String> {
    List<GalleryImage> findAllByOrderByCreatedAtDesc();
}
