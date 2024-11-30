package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.EconomicHeatData;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;

@Service
public class EconomicHeatMapService {

    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 25000.0, 50000.0, 75000.0, 100000.0,
            125000.0, 150000.0, 175000.0, 200000.0, Double.MAX_VALUE);
    private static final List<String> COLORS = Arrays.asList(
            "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6",
            "#4292c6", "#2171b5", "#08519c", "#08306b");

    public EconomicHeatData calculateEconomicData(Precinct precinct) {
        double medianIncome = precinct.getProperties().getMednInc21(); // Assuming 'MednInc21' field exists
        int binIndex = BinUtils.determineBinIndex(medianIncome, BIN_EDGES);
        String color = COLORS.get(binIndex);
        String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "$%,.0f");

        EconomicHeatData data = new EconomicHeatData();
        data.setMedianIncome(medianIncome);
        data.setBin(binLabel);
        data.setColor(color);

        return data;
    }

    public Map<String, String> getLegend() {
        return LegendUtils.generateLegend(BIN_EDGES, COLORS, "$%,.0f");
    }
}
