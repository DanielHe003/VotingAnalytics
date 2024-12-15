package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.voter_analysis.voter_analysis.models.BoxWhiskerData;

import java.util.List;

public interface BoxWhiskerDataRepository extends MongoRepository<BoxWhiskerData, String> {

    @Query("{ 'stateId': ?0, 'analysisType': ?1, 'groupName': ?2 }")
    BoxWhiskerData findByStateIdAndAnalysisTypeAndGroupName(int stateId, String analysisType, String groupName);
}
