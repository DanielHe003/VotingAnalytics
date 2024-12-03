package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.RegionTypeHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import java.util.*;


@Service
public class RegionTypeHeatMapService {

    private static final Map<String, String> REGION_COLORS = Map.of(
            "Urban", "#1f77b4",
            "Suburban", "#ff7f0e",
            "Rural", "#2ca02c"
    );

    public RegionTypeHeatDataDTO calculateRegionTypeData(Precinct precinct) {
        String regionType = precinct.getProperties().getCategory();
        String color = REGION_COLORS.getOrDefault(regionType, "#cccccc"); // Default color

        RegionTypeHeatDataDTO data = new RegionTypeHeatDataDTO();
        data.setType(regionType);
        data.setColor(color);

        return data;
    }

    public Map<String, String> getLegend() {
        return new LinkedHashMap<>(REGION_COLORS);
    }
}
