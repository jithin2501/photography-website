package com.auralens.studio.repositories;

import com.auralens.studio.models.ServicePackagePrice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicePackagePriceRepository extends MongoRepository<ServicePackagePrice, String> {
}
