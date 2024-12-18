package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.EconomicHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;

@Service
public class EconomicHeatMapService {

    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 25000.0, 50000.0, 75000.0, 100000.0,
            125000.0, Double.MAX_VALUE);
    private static final List<String> COLORS = Arrays.asList(
            "#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d",
            "#238b45", "#005a32");

    public EconomicHeatDataDTO calculateEconomicData(Precinct precinct) {
        double medianIncome = precinct.getProperties().getMednInc21(); 
        int binIndex = BinUtils.determineBinIndex(medianIncome, BIN_EDGES);
        String color = COLORS.get(binIndex);
        String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "$%,.0f");

        EconomicHeatDataDTO data = new EconomicHeatDataDTO();
        data.setMedianIncome(medianIncome);
        data.setBin(binLabel);
        data.setColor(color);
        data.setPrecinctKey(precinct.getProperties().getSrPrecKey());
        return data;
    }

    public Map<String, String> getLegend() {
        return LegendUtils.generateLegend(BIN_EDGES, COLORS, "$%,.0f");
    }
}
