package com.auralens.studio.repositories;

import com.auralens.studio.models.WheelImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WheelImageRepository extends MongoRepository<WheelImage, String> {
    List<WheelImage> findAllByOrderBySlotAsc();
    Optional<WheelImage> findBySlot(int slot);
}
