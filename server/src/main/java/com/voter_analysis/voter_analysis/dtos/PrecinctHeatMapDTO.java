package com.voter_analysis.voter_analysis.dtos;

import java.util.Map;
import lombok.Data;

@Data
public class PrecinctHeatMapDTO {
    private int stateId;
    private String precinctKey;
    private Map<String, DemographicHeatData> demographicDataMap;
    private EconomicHeatData economicData;
    private RegionTypeHeatData regionTypeData;
    private PovertyHeatData povertyData;
    private PoliticalIncomeHeatData politicalIncomeData;
    private GeometryDTO geometry;
}
