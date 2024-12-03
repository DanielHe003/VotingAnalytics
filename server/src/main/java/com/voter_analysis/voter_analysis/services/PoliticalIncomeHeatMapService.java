package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.PoliticalIncomeHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;

@Service
public class PoliticalIncomeHeatMapService {

    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 25000.0, 50000.0, 75000.0, 100000.0,
            125000.0, 150000.0, 175000.0, 200000.0, Double.MAX_VALUE);

    // Blue to Red gradient colors based on party
    private static final List<String> DEM_COLORS = Arrays.asList(
        "#d0e1f9", "#a6c8e1", "#7dafca", "#5596b2", "#2d7d9b",
        "#046583", "#004d6c", "#003655", "#001f3e"
    );

    // Updated Republican colors (red shades)
    private static final List<String> REP_COLORS = Arrays.asList(
        "#fde0dd", "#fab3b1", "#f78686", "#f4595a", "#f12d2f",
        "#de1416", "#ad1012", "#7d0c0d", "#4c0809"
    );

    public PoliticalIncomeHeatDataDTO calculatePoliticalIncomeData(Precinct precinct) {
        double medianIncome = precinct.getProperties().getMednInc21();
        int binIndex = BinUtils.determineBinIndex(medianIncome, BIN_EDGES);
        String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "$%,.0f");

        // Determine dominant party
        long demVotes = precinct.getProperties().getPrsDem01();
        long repVotes = precinct.getProperties().getPrsRep01();
        String party;
        String color;

        if (demVotes > repVotes) {
            party = "Democrat";
            color = DEM_COLORS.get(binIndex);
        } else if (repVotes > demVotes) {
            party = "Republican";
            color = REP_COLORS.get(binIndex);
        } else {
            party = "Tie";
            color = "#cccccc"; // Neutral color
        }

        PoliticalIncomeHeatDataDTO data = new PoliticalIncomeHeatDataDTO();
        data.setMedianIncome(medianIncome);
        data.setBin(binLabel);
        data.setColor(color);
        data.setDominantParty(party);

        return data;
    }

    public Map<String, String> getLegend() {
        // Combine DEM_COLORS and REP_COLORS into a legend
        Map<String, String> legend = new LinkedHashMap<>();
        for (int i = 0; i < BIN_EDGES.size() - 1; i++) {
            String binLabel = BinUtils.createBinLabel(i, BIN_EDGES, "$%,.0f");
            legend.put(binLabel + " (Democrat)", DEM_COLORS.get(i));
            legend.put(binLabel + " (Republican)", REP_COLORS.get(i));
        }
        return legend;
    }
}
