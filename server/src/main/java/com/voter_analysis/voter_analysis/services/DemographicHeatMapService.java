package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.DemographicHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;

@Service
public class DemographicHeatMapService {
    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 10.0, 20.0, 30.0, 40.0, 50.0,
    60.0, 70.0, 80.0, 90.0, 100.0);
    private static final List<String> COLORS = Arrays.asList(
        "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c",
        "#f16913", "#d94801", "#a63603", "#7f2704", "#5a1f03");

    public Map<String, DemographicHeatDataDTO> calculateDemographicData(Precinct precinct, List<String> demographicGroups) {
        Map<String, DemographicHeatDataDTO> demographicDataMap = new HashMap<>();
        for (String demographicGroup : demographicGroups) {
            double percentage = calculateDemographicPercentage(precinct, demographicGroup);
            int binIndex = BinUtils.determineBinIndex(percentage, BIN_EDGES);
            String color = COLORS.get(binIndex);
            String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "%,.0f%%");

            DemographicHeatDataDTO data = new DemographicHeatDataDTO();
            data.setPercentage(percentage);
            data.setBin(binLabel);
            data.setColor(color);
            data.setPrecinctKey(precinct.getProperties().getSrPrecKey());

            demographicDataMap.put(demographicGroup, data);
        }
        return demographicDataMap;
    }

    private double calculateDemographicPercentage(Precinct precinct, String demographicGroup) {
        Precinct.Properties props = precinct.getProperties();
        double demographicCount;
        double totalPopulation = props.getTotPop();

        switch (demographicGroup.toLowerCase()) {
            case "white":
                demographicCount = props.getPopWht();
                break;
            case "black":
                demographicCount = props.getPopBlk();
                break;
            case "hispanic":
                demographicCount = props.getPopHisLat();
                break;
            case "asian":
                demographicCount = props.getPopAsn();
                break;
            case "american_indian_alaska_native":
                demographicCount = props.getPopAindalk();
                break;
            case "native_hawaiian_pacific_islander":
                demographicCount = props.getPopHipi();
                break;
            case "multiracial":
                demographicCount = props.getPopTwoMor();
                break;
            case "other":
                demographicCount = props.getPopOth();
                break;
            default:
                throw new IllegalArgumentException("Unknown demographic group: " + demographicGroup);
        }

        // Avoid division by zero
        if (totalPopulation == 0) {
            return 0.0;
        }

        return (demographicCount / totalPopulation) * 100.0;
    }

    public Map<String, String> getLegend() {
        return LegendUtils.generateLegend(BIN_EDGES, COLORS, "%,.0f%%");
    }
}
