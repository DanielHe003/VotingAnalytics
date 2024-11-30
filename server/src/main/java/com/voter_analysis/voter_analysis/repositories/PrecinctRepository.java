package com.voter_analysis.voter_analysis.repositories;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.voter_analysis.voter_analysis.models.Precinct;
import java.util.List;
import org.springframework.data.domain.Page;


public interface PrecinctRepository extends MongoRepository<Precinct, String> {
    Page<Precinct> findByPropertiesStateId(int stateId,Pageable pageable);
}
