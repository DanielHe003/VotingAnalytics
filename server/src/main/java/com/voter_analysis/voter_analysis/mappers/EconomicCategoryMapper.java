package com.voter_analysis.voter_analysis.mappers;

import java.util.Map;

import lombok.Data;

@Data
public class EconomicCategoryMapper {
    private static final Map<String, String> economicCategoryToFieldMap = Map.of(
        "low", "LOW_INC",            // 0 - 35k
        "low_mid", "LOW_MID_INC",    // 35k - 60k
        "upper_mid", "UP_MID_INC",   // 60k - 120k
        "upper", "UP_INC"            // 125k and over
    );

    public static String getDatabaseField(String userInput) {
        return economicCategoryToFieldMap.getOrDefault(userInput.toLowerCase(), null);
    }
}
