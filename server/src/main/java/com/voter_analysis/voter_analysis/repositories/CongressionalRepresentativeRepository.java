package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.voter_analysis.voter_analysis.models.CongressionalRepresentative;
import java.util.List;

public interface CongressionalRepresentativeRepository extends MongoRepository<CongressionalRepresentative, String> {
    List<CongressionalRepresentative> findByStateId(int stateId);
    List<CongressionalRepresentative> findByStateIdAndDistrictId(int stateId, int districtId);
}
