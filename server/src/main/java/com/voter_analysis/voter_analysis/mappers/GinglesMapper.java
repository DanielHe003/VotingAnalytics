package com.voter_analysis.voter_analysis.mappers;

import java.util.Map;
import com.voter_analysis.voter_analysis.dtos.IncomeGinglesDTO;
import com.voter_analysis.voter_analysis.dtos.IncomeRaceGinglesDTO;
import com.voter_analysis.voter_analysis.dtos.RaceGinglesDTO;
import org.springframework.stereotype.Component;

@Component 
public class GinglesMapper {

    // Use Case #12: Map to RaceGinglesDTO for scatter plot by race
    public RaceGinglesDTO toRaceGinglesDTO(Map<String, Object> data) {
        RaceGinglesDTO dto = new RaceGinglesDTO();
        dto.setPrecinctKey((String) data.get("Precinct_key"));
        dto.setRaceXAxis(Double.parseDouble((String) data.get("PCT_RACE")));
        dto.setDemocracticShareYAxis(Double.parseDouble((String) data.get("PCT_DEM")));
        dto.setRepublicanShareYaxis(Double.parseDouble((String) data.get("PCT_REP")));
        dto.setDominantPartyColor(
            dto.getDemocracticShareYAxis()> dto.getRepublicanShareYaxis() ? "Blue" : "Red"
        );
        return dto;
    }

    // Use Case #13: Map to IncomeGinglesDTO for scatter plot by income
    public IncomeGinglesDTO toIncomeGinglesDTO(Map<String, Object> data, String regionType) {
        IncomeGinglesDTO dto = new IncomeGinglesDTO();
        dto.setPrecinctKey((String) data.get("Precinct_key"));
        dto.setMedianIncomeXaxis(Double.parseDouble((String) data.get("MEDN_INC")));
        dto.setDemocraticVoteShareYaxis(Double.parseDouble((String) data.get("PCT_DEM")));
        dto.setRepublicanVoteShareYaxis(Double.parseDouble((String) data.get("PCT_REP")));
        dto.setDominantPartyColor(
            dto.getDemocraticVoteShareYaxis() > dto.getRepublicanVoteShareYaxis() ? "Blue" : "Red"
        );
        dto.setRegionType(regionType);
        return dto;
    }

    // Use Case #14: Map to IncomeRaceGinglesDTO for scatter plot by income and race
    public IncomeRaceGinglesDTO toIncomeRaceGinglesDTO(Map<String, Object> data) {
        IncomeRaceGinglesDTO dto = new IncomeRaceGinglesDTO();
        dto.setPrecinctKey((String) data.get("Precinct_key"));
        dto.setCompositeIndexXaxis(Double.parseDouble((String) data.get("PCT_RACE_INC")));
        dto.setDemocraticVoteShareYaxis(Double.parseDouble((String) data.get("PCT_DEM")));
        dto.setRepublicanVoteShareYaxis(Double.parseDouble((String) data.get("PCT_REP")));
        dto.setDominantPartyColor(
            dto.getDemocraticVoteShareYaxis() > dto.getRepublicanVoteShareYaxis() ? "Blue" : "Red"
        );
        return dto;
    }
}
