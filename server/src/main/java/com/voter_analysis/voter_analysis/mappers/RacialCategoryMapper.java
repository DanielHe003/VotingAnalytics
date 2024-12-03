package com.voter_analysis.voter_analysis.mappers;
import java.util.Map;

import lombok.Data;

@Data
public class RacialCategoryMapper {
    private static final Map<String, String> racialCategoryToFieldMap = Map.of(
        "white", "POP_WHT",
        "black", "POP_BLK",
        "hispanic", "POP_HISLAT",
        "asian", "POP_ASN",
        "american_indian_alaska_native", "POP_AINDALK",
        "native_hawaiian_pacific_islander", "POP_HIPI",
        "multiracial", "POP_TWOMOR",
        "other", "POP_OTH"
    );

    public static String getDatabaseField(String userInput) {
        return racialCategoryToFieldMap.getOrDefault(userInput.toLowerCase(), null);
    }
}
