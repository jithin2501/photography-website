package com.auralens.studio.repositories;

import com.auralens.studio.models.SiteSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteSettingsRepository extends MongoRepository<SiteSettings, String> {
}
