package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.voter_analysis.voter_analysis.models.DistrictPlan;
import java.util.List;

public interface DistrictPlanRepository extends MongoRepository<DistrictPlan, String> {

    @Query("{ 'stateId': ?0 }")
    List<DistrictPlan> findByStateId(int stateId);

    @Query("{ 'stateId': ?0, 'planId': ?1 }")
    DistrictPlan findByStateIdAndPlanId(int stateId, String planId);

    @Query("{ 'stateId': ?0, 'planNum': ?1 }")
    DistrictPlan findByStateIdAndPlanNum(int stateId, int planNum);

}
