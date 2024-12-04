package com.voter_analysis.voter_analysis.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.voter_analysis.voter_analysis.models.GinglesAnalysis;
import java.util.List;

public interface GinglesAnalysisRepository extends MongoRepository<GinglesAnalysis, String> {
    List<GinglesAnalysis> findByStateIdAndAnalysisType(int stateId, String analysisType);
    List<GinglesAnalysis> findByStateIdAndAnalysisTypeAndRegionType(int stateId, String analysisType, String regionType);
    List<GinglesAnalysis> findByStateIdAndRegionType(int stateId, String regionType);

}
