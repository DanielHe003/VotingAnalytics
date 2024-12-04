package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.voter_analysis.voter_analysis.models.CongressionalDistrict;
import java.util.List;
import java.util.Optional;

public interface CongressionalDistrictRepository extends MongoRepository<CongressionalDistrict, String> {
    List<CongressionalDistrict> findByPropertiesStateId(int stateId);
    Optional<CongressionalDistrict> findByPropertiesStateIdAndPropertiesDistrictId(int stateId, int districtId);

}
