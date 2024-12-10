package com.voter_analysis.voter_analysis.mappers;

import java.util.HashMap;
import java.util.Map;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.dtos.*;

@Mapper(componentModel = "spring")
public interface PrecinctMapper {


    GeometryDTO toGeometryDTO(Precinct.Geometry geometry);

    // Use Case #15: Map Precinct to GinglesTableDTO for tabular data
    @Mapping(source = "properties.srPrecKey", target = "precinctKey")
    @Mapping(source = "properties.pctDem", target = "pctDem")
    @Mapping(source = "properties.pctRep", target = "pctRep")
    @Mapping(source = "properties.totVotes", target = "totVotes")
    @Mapping(source = "properties.totPop", target = "totPop")
    @Mapping(source = "properties.mednInc21", target = "medianIncome")
    @Mapping(target = "urbanPct", expression = "java(calculatePercentage(precinct.getProperties().getUrban(), precinct.getProperties().getTotPop()))")
    @Mapping(target = "ruralPct", expression = "java(calculatePercentage(precinct.getProperties().getRural(), precinct.getProperties().getTotPop()))")
    @Mapping(target = "suburbanPct", expression = "java(calculatePercentage(precinct.getProperties().getSuburban(), precinct.getProperties().getTotPop()))")
    @Mapping(source = "properties.povertyPct", target = "povertyPct")
    GinglesTableDTO toGinglesTableDTO(Precinct precinct);


    // Helper method to calculate percentages
    default double calculatePercentage(long part, long total) {
        return total > 0 ? (double) part / total * 100 : 0.0;
    }
    default FeatureDTO mapToFeatureDTO(Precinct precinct) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("stateId", precinct.getProperties().getStateId());
        properties.put("precinctKey", precinct.getProperties().getSrPrecKey());
        FeatureDTO feature = new FeatureDTO();
        feature.setGeometry(toGeometryDTO(precinct.getGeometry()));
        feature.setProperties(properties);
        return feature;
    }
    
    
    

}
