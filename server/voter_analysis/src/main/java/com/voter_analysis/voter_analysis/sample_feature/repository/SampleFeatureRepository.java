package com.voter_analysis.voter_analysis.sample_feature.repository;

import com.voter_analysis.voter_analysis.sample_feature.model.SampleFeature;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleFeatureRepository extends MongoRepository<SampleFeature, String> {
    // Define your custom queries here
}
