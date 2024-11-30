package com.voter_analysis.voter_analysis.utils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.Data;
@Data
public class LegendUtils {

    public static Map<String, String> generateLegend(List<Double> binEdges, List<String> colors, String format) {
        Map<String, String> legend = new LinkedHashMap<>();
        for (int i = 0; i < binEdges.size() - 1; i++) {
            String binLabel = BinUtils.createBinLabel(i, binEdges, format);
            legend.put(binLabel, colors.get(i));
        }
        return legend;
    }
}
