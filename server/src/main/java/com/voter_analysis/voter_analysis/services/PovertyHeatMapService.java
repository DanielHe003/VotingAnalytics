package com.voter_analysis.voter_analysis.services;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.dtos.PovertyHeatDataDTO;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.utils.BinUtils;
import com.voter_analysis.voter_analysis.utils.LegendUtils;
import java.util.*;


@Service
public class PovertyHeatMapService {

    private static final List<Double> BIN_EDGES = Arrays.asList(0.0, 10.0, 20.0, 30.0, 40.0, 50.0,
            60.0, 70.0, 80.0, 90.0, 100.0);
    private static final List<String> COLORS = Arrays.asList(
        "#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0",
        "#e7298a", "#ce1256", "#980043", "#67001f", "#400012");

    public PovertyHeatDataDTO calculatePovertyData(Precinct precinct) {
        double povertyPercentage = precinct.getProperties().getPovertyPct();
        int binIndex = BinUtils.determineBinIndex(povertyPercentage, BIN_EDGES);
        String color = COLORS.get(binIndex);
        String binLabel = BinUtils.createBinLabel(binIndex, BIN_EDGES, "%.0f%%");

        PovertyHeatDataDTO data = new PovertyHeatDataDTO();
        data.setPovertyPercentage(povertyPercentage);
        data.setBin(binLabel);
        data.setColor(color);

        return data;
    }

    public Map<String, String> getLegend() {
        return LegendUtils.generateLegend(BIN_EDGES, COLORS, "%.0f%%");
    }
}
