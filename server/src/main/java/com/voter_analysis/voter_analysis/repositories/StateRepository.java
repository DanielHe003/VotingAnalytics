package com.voter_analysis.voter_analysis.repositories;
import com.voter_analysis.voter_analysis.models.State;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface StateRepository extends MongoRepository<State, String> {
    @Query("{ 'properties.NAME': { $regex: ?0, $options: 'i' } }")
    State findByPropertiesName(String name);
}
