package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.PovertyHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;


@Service
public class PovertyHeatMapService {

    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 10.0, 20.0, 30.0, 40.0,50.0,Double.MAX_VALUE);
    private static final List<String> COLORS = Arrays.asList(
        "#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8",
        "#807dba", "#6a51a3", "#54278f", "#3f007d"
    );

            

    public PovertyHeatDataDTO calculatePovertyData(Precinct precinct) {
        double povertyPercentage = precinct.getProperties().getPovertyPct();
        int binIndex = BinUtils.determineBinIndex(povertyPercentage, BIN_EDGES);
        String color = COLORS.get(binIndex);
        String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "%.0f%%");

        PovertyHeatDataDTO data = new PovertyHeatDataDTO();
        data.setPrecinctKey(precinct.getProperties().getSrPrecKey());
        data.setPovertyPercentage(povertyPercentage);
        data.setBin(binLabel);
        data.setColor(color);

        return data;
    }

    public Map<String, String> getLegend() {
        return LegendUtils.generateLegend(BIN_EDGES, COLORS, "%.0f%%");
    }
}
