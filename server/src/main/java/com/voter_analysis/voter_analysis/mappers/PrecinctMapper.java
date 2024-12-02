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

    default IncomeGinglesDTO toIncomeGinglesDTO(Precinct precinct) {
        IncomeGinglesDTO dto = new IncomeGinglesDTO();
        dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
        dto.setMedianIncomeXaxis(precinct.getProperties().getMednInc21());
        dto.setPartyVoteShareYaxis(precinct.getProperties().getPctDem());
        dto.setDominantPartyColor(
            precinct.getProperties().getPctDem() > precinct.getProperties().getPctRep() ? "Blue" : "Red"
        );
        dto.setRegionType(precinct.getProperties().getCategory());
        return dto;
    }
    default RaceGinglesDTO toRaceGinglesDTO(Precinct precinct, double racialPercentage) {
        RaceGinglesDTO dto = new RaceGinglesDTO();
        dto.setPrecinctKey(precinct.getProperties().getSrPrecKey()); // For identification
        dto.setRaceXAxis(racialPercentage);
        dto.setPartyVoteShareYAxis(precinct.getProperties().getPctDem());
        dto.setDominantPartyColor(
            precinct.getProperties().getPctDem() > precinct.getProperties().getPctRep() ? "Blue" : "Red"
        );
        return dto;
    }
    default IncomeRaceGinglesDTO toIncomeRaceGinglesDTO(Precinct precinct, double racialPercentage, double minIncome, double maxIncome, double minRacePct, double maxRacePct) {
        IncomeRaceGinglesDTO dto = new IncomeRaceGinglesDTO();
        
        // Normalize income and race percentage
        double normalizedIncome = (precinct.getProperties().getMednInc21() - minIncome) / (maxIncome - minIncome);
        double normalizedRacePct = (racialPercentage - minRacePct) / (maxRacePct - minRacePct);
        
        // Combine with equal weights
        double compositeIndex = (normalizedIncome + normalizedRacePct) / 2.0;
        
        dto.setCompositeIndexXaxis(compositeIndex); // X-axis: Composite Index
        dto.setPartyVoteShareYaxis(precinct.getProperties().getPctDem()); // Y-axis: Democratic Party Vote Share
        dto.setDominantPartyColor(
            precinct.getProperties().getPctDem() > precinct.getProperties().getPctRep() ? "Blue" : "Red"
        );
        return dto;
    }

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
