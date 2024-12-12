package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.voter_analysis.voter_analysis.models.EIAnalysis;
import java.util.List;

public interface EIAnalysisRepository extends MongoRepository<EIAnalysis, String> {
    @Query("{ 'stateId': ?0, 'analysisType': 'race', 'candidateName': ?1, 'data.race': ?2 }")
    List<EIAnalysis> findByStateIdAndAnalysisTypeAndCandidateNameAndRace(int stateId, String candidateName, String race);

    @Query("{ 'stateId': ?0, 'analysisType': 'economic', 'candidateName': ?1, 'data.group': ?2 }")
    List<EIAnalysis> findByStateIdAndAnalysisTypeAndCandidateNameAndGroupEconomic(int stateId, String candidateName, String group);
    
    @Query("{ 'stateId': ?0, 'analysisType': 'race', 'candidateName': ?1, 'data.race': ?2, 'region_type': ?3 }")
    List<EIAnalysis> findByStateIdAndAnalysisTypeAndCandidateNameAndRaceAndRegionType(int stateId, String candidateName, String race, String regionType);

    @Query("{ 'stateId': ?0, 'analysisType': 'economic', 'candidateName': ?1, 'data.group': ?2, 'region_type': ?3 }")
    List<EIAnalysis> findByStateIdAndAnalysisTypeAndCandidateNameAndGroupEconomicAndRegionType(int stateId, String candidateName, String group, String regionType);

    @Query("{ 'stateId': ?0, 'analysisType': 'region', 'candidateName': ?1, 'data.group': ?2 }")
    List<EIAnalysis> findByStateIdAndAnalysisTypeAndCandidateNameAndGroupRegion(int stateId, String candidateName, String group);
}

