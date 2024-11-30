package com.voter_analysis.voter_analysis.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "precincts")
public class Precinct {

    @Id
    private String id; // MongoDB ID

    private String type;
    private Properties properties;
    private Geometry geometry;

    @Data
    public static class Properties {

        @Field("state_id")
        private int stateId;

        @Field("SRPREC_KEY")
        private String srPrecKey;

        @Field("PCT_DEM")
        private double pctDem;

        @Field("PCT_REP")
        private double pctRep;

        @Field("PRSDEM01")
        private long prsDem01;

        @Field("PRSREP01")
        private long prsRep01;

        @Field("TOT_VOTES")
        private long totVotes;

        @Field("TOT_POP")
        private long totPop;

        @Field("POP_HISLAT")
        private long popHisLat;

        @Field("POP_WHT")
        private long popWht;

        @Field("POP_BLK")
        private long popBlk;

        @Field("POP_AINDALK")
        private long popAindalk;

        @Field("POP_ASN")
        private long popAsn;

        @Field("POP_HIPI")
        private long popHipi;

        @Field("POP_OTH")
        private long popOth;

        @Field("POP_TWOMOR")
        private long popTwoMor;

        @Field("CD_ID")
        private int cdId;

        @Field("TOT_HOUS21")
        private long totHous21;

        @Field("LESS_10K21")
        private double less10K21;

        @Field("10K_15K21")
        private double k10To15K21;

        @Field("15K_20K21")
        private double k15To20K21;

        @Field("20K_25K21")
        private double k20To25K21;

        @Field("25K_30K21")
        private double k25To30K21;

        @Field("30K_35K21")
        private double k30To35K21;

        @Field("35K_40K21")
        private double k35To40K21;

        @Field("40K_45K21")
        private double k40To45K21;

        @Field("45K_50K21")
        private double k45To50K21;

        @Field("50K_60K21")
        private double k50To60K21;

        @Field("60K_75K21")
        private double k60To75K21;

        @Field("75K_100K21")
        private double k75To100K21;

        @Field("100_125K21")
        private double k100To125K21;

        @Field("125_150K21")
        private double k125To150K21;

        @Field("150_200K21")
        private double k150To200K21;

        @Field("200K_MOR21")
        private double k200KMor21;

        @Field("MEDN_INC21")
        private double mednInc21;

        @Field("AREALAND")
        private long areaLand;

        @Field("Urban")
        private long urban;

        @Field("Rural")
        private long rural;

        @Field("Suburban")
        private long suburban;

        @Field("Density")
        private double density;

        @Field("Category")
        private String category;

        @Field("POVERTY")
        private double poverty;

        @Field("POVERTY_PCT")
        private double povertyPct;
    }

    @Data
    public static class Geometry {
        private String type; // Polygon or MultiPolygon
        private List<?> coordinates; // Nested array of doubles
    }
}
