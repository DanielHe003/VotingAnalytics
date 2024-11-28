package com.voter_analysis.voter_analysis.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "congressional_districts")
public class CongressionalDistrict {

    @Id
    private String id; // MongoDB ID

    private String type;
    private Properties properties;
    private Geometry geometry;

    @Data
    public static class Properties {

        @Field("state_id")
        private int stateId;

        @Field("ID")
        private int districtId;

        @Field("PCT_DEM")
        private double pctDem;

        @Field("PCT_REP")
        private double pctRep;

        @Field("PRSDEM01")
        private int prsDem01;

        @Field("PRSREP01")
        private int prsRep01;

        @Field("TOT_VOTES")
        private int totVotes;

        @Field("tot_pop")
        private double totPop;

        @Field("POP_HISLAT")
        private double popHisLat;

        @Field("POP_WHT")
        private double popWht;

        @Field("POP_BLK")
        private double popBlk;

        @Field("POP_AINDALK")
        private double popAindalk;

        @Field("POP_ASN")
        private double popAsn;

        @Field("POP_HIPI")
        private double popHipi;

        @Field("POP_OTH")
        private double popOth;

        @Field("POP_TWOMOR")
        private double popTwoMor;

        @Field("TOT_HOUS21")
        private double totHous21;

        @Field("AREALAND")
        private double areaLand;

        @Field("Urban")
        private double urban;

        @Field("Rural")
        private double rural;

        @Field("Suburban")
        private double suburban;

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
