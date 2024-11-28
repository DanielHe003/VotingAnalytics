package com.voter_analysis.voter_analysis.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;

@Data
@Document(collection = "states")
public class State {

    @Id
    private String id; // MongoDB ID

    private String type;
    private Properties properties;
    private Geometry geometry;

    @Data
    public static class Properties {
        @Field("NAME")
        private String name;

        @Field("PCT_DEM")
        private double pctDem;

        @Field("PCT_REP")
        private double pctRep;

        @Field("PRSDEM01")
        private long prsDem01; // Changed from int to long

        @Field("PRSREP01")
        private long prsRep01; // Changed from int to long

        @Field("TOT_VOTES")
        private long totVotes; // Changed from int to long

        @Field("TOT_POP")
        private long totPop; // Changed from double to long

        @Field("POP_HISLAT")
        private long popHisLat; // Changed from double to long

        @Field("POP_WHT")
        private long popWht; // Changed from double to long

        @Field("POP_BLK")
        private long popBlk; // Changed from double to long

        @Field("POP_AINDALK")
        private long popAindalk; // Changed from double to long

        @Field("POP_ASN")
        private long popAsn; // Changed from double to long

        @Field("POP_HIPI")
        private long popHipi; // Changed from double to long

        @Field("POP_OTH")
        private long popOth; // Changed from double to long

        @Field("POP_TWOMOR")
        private long popTwoMor; // Changed from double to long

        @Field("TOT_HOUS21")
        private long totHous21; // Changed from double to long

        @Field("LESS_10K21")
        private long less10K21; // Changed from double to long

        @Field("10K_15K21")
        private long k10To15K21; // Changed from double to long

        @Field("15K_20K21")
        private long k15To20K21; // Changed from double to long

        @Field("20K_25K21")
        private long k20To25K21; // Changed from double to long

        @Field("25K_30K21")
        private long k25To30K21; // Changed from double to long

        @Field("30K_35K21")
        private long k30To35K21; // Changed from double to long

        @Field("35K_40K21")
        private long k35To40K21; // Changed from double to long

        @Field("40K_45K21")
        private long k40To45K21; // Changed from double to long

        @Field("45K_50K21")
        private long k45To50K21; // Changed from double to long

        @Field("50K_60K21")
        private long k50To60K21; // Changed from double to long

        @Field("60K_75K21")
        private long k60To75K21; // Changed from double to long

        @Field("75K_100K21")
        private long k75To100K21; // Changed from double to long

        @Field("100_125K21")
        private long k100To125K21; // Changed from double to long

        @Field("125_150K21")
        private long k125To150K21; // Changed from double to long

        @Field("150_200K21")
        private long k150To200K21; // Changed from double to long

        @Field("200K_MOR21")
        private long k200KMor21; // Changed from double to long

        @Field("MEDN_INC21")
        private double mednInc21; // Retained as double for precision

        @Field("AREALAND")
        private long areaLand; // Retained as long

        @Field("Urban")
        private long urban; // Retained as double

        @Field("Rural")
        private long rural; // Retained as double

        @Field("Suburban")
        private long suburban; // Retained as double

        @Field("Density")
        private double density; // Retained as double

        @Field("Category")
        private String category;

        @Field("POVERTY")
        private double poverty; // Retained as double

        @Field("POVERTY_PCT")
        private double povertyPct; // Retained as double
    }

    @Data
    public static class Geometry {
        private String type; // Polygon or MultiPolygon
        private List<?> coordinates; // Nested array of doubles

        // Getters, setters, and constructors handled by @Data
    }
}
