package com.voter_analysis.voter_analysis.mappers;

import java.util.HashMap;
import java.util.Map;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.dtos.*;

@Mapper(componentModel = "spring")
public interface PrecinctMapper {


    default FeatureDTO toFeatureDTO(Precinct precinct,
                                    Map<String, DemographicHeatDataDTO> demographicDataMap,
                                    EconomicHeatDataDTO economicData,
                                    RegionTypeHeatDataDTO regionTypeData,
                                    PovertyHeatDataDTO povertyData,
                                    PoliticalIncomeHeatDataDTO politicalIncomeData) {
        if (precinct == null) {
            return null;
        }

        FeatureDTO feature = new FeatureDTO();
        feature.setGeometry(toGeometryDTO(precinct.getGeometry()));

        Map<String, Object> properties = new HashMap<>();
        properties.put("stateId", precinct.getProperties().getStateId());
        properties.put("precinctKey", precinct.getProperties().getSrPrecKey());

        // Include heat map data
        properties.put("demographicDataMap", demographicDataMap);
        properties.put("economicData", economicData);
        properties.put("regionTypeData", regionTypeData);
        properties.put("povertyData", povertyData);
        properties.put("politicalIncomeData", politicalIncomeData);

        feature.setProperties(properties);

        return feature;
    }
    GeometryDTO toGeometryDTO(Precinct.Geometry geometry);


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

    
    
    

}
