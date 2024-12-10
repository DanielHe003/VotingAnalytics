package com.voter_analysis.voter_analysis.utils;

import java.util.List;

import lombok.Data;
@Data
public class BinUtils {

    public static int determineBinIndex(double value, List<Double> binEdges) {
        for (int i = 0; i < binEdges.size() - 1; i++) {
            if (value >= binEdges.get(i) && value < binEdges.get(i + 1)) {
                return i;
            }
        }
        return binEdges.size() - 2;
    }

    public static String createBinLabel(int binIndex, List<Double> binEdges, String format) {
        double lowerBound = binEdges.get(binIndex);
        double upperBound = binEdges.get(binIndex + 1);
        if (upperBound == Double.MAX_VALUE) {
            return String.format(format + "+", lowerBound);
        } else {
            return String.format(format + " - " + format, lowerBound, upperBound);
        }
    }
}

