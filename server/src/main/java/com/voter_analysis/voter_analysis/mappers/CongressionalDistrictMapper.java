package com.voter_analysis.voter_analysis.mappers;

import java.util.HashMap;
import java.util.Map;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.voter_analysis.voter_analysis.models.CongressionalDistrict;
import com.voter_analysis.voter_analysis.dtos.*;


@Mapper(componentModel = "spring")
public interface CongressionalDistrictMapper {

    @Mapping(source = "properties.stateId", target = "stateId")
    @Mapping(source = "properties.districtId", target = "districtId")
    @Mapping(source = "geometry", target = "geometry")
    CongressionalDistrictMapDTO toMapDTO(CongressionalDistrict district);


    default FeatureDTO toFeatureDTO(CongressionalDistrict district) {
        if (district == null) {
            return null;
        }

        FeatureDTO feature = new FeatureDTO();
        feature.setGeometry(toGeometryDTO(district.getGeometry()));

        Map<String, Object> properties = new HashMap<>();
        properties.put("stateId", district.getProperties().getStateId());
        properties.put("districtId", district.getProperties().getDistrictId());
        // Add other properties as needed

        feature.setProperties(properties);
        return feature;
    }
    default FeatureDTO toFeatureDTO(CongressionalDistrict district, CongressionalRepresentationDTO representationDTO) {
        if (district == null) {
            return null;
        }

        FeatureDTO feature = new FeatureDTO();
        feature.setGeometry(toGeometryDTO(district.getGeometry()));

        Map<String, Object> properties = new HashMap<>();
        properties.put("representation", representationDTO); // Add CongressionalRepresentationDTO as a property

        feature.setProperties(properties);

        return feature;
    }
    
    @Mapping(source = "properties.stateId", target = "stateId")
    @Mapping(source = "properties.districtId", target = "districtId")
    @Mapping(source = "properties.mednInc21", target = "averageHouseholdIncome")
    @Mapping(source = "properties.povertyPct", target = "povertyPercentage")
    @Mapping(expression = "java(calculatePercentage(district.getProperties().getUrban(), district.getProperties().getTotPop()))", target = "urbanPercentage")
    @Mapping(expression = "java(calculatePercentage(district.getProperties().getRural(), district.getProperties().getTotPop()))", target = "ruralPercentage")
    @Mapping(expression = "java(calculatePercentage(district.getProperties().getSuburban(), district.getProperties().getTotPop()))", target = "suburbanPercentage")
    @Mapping(expression = "java(calculateVoteMargin(district))", target = "voteMarginPercentage")
    CongressionalRepresentationDTO toRepresentationDTO(CongressionalDistrict district);

    // Helper methods
    default String getRepresentativeName(CongressionalDistrict district) {
        // Retrieve representative name logic here, e.g., from another source or database
        return "Representative Name";
    }

    default String getRepresentativeParty(CongressionalDistrict district) {
        // Retrieve party affiliation logic here, e.g., from another source or database
        return "Party";
    }

    default String getRepresentativeRacialGroup(CongressionalDistrict district) {
        // Retrieve racial/ethnic group logic here, e.g., from another source or database
        return "Racial/Ethnic Group";
    }

    default double calculatePercentage(long count, long total) {
        if (total == 0) {
            return 0;
        }
        return (double) count / total * 100;
    }

    default double calculateVoteMargin(CongressionalDistrict district) {
        double pctDem = district.getProperties().getPctDem();
        double pctRep = district.getProperties().getPctRep();
        return Math.abs(pctDem - pctRep);
    }

    GeometryDTO toGeometryDTO(CongressionalDistrict.Geometry geometry);
}
