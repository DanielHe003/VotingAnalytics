package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.voter_analysis.voter_analysis.models.Precinct;
import java.util.List;

public interface PrecinctRepository extends MongoRepository<Precinct, String> {
    List<Precinct> findByPropertiesStateId(String stateId);
}
