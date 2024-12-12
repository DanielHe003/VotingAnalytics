package com.voter_analysis.voter_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "ei_analysis")
public class EIAnalysis {

    @Id
    private String id;

    @Field("stateId")
    private int stateId;

    @Field("analysisType")
    private String analysisType;

    @Field("candidateName")
    private String candidateName;

    @Field("fileName")
    private String fileName;

    @Field("region_type")
    private String regionType;

    private List<AnalysisData> data;

    @Data
    public static class AnalysisData {
        private String group;
        private String race;
        private Object x; // Changed to Object
        private Object y; // Changed to Object

        public List<Double> getXAsDoubles() {
            if (x instanceof List<?> list) {
                // Convert each element to Double
                return list.stream()
                           .map(element -> Double.parseDouble(element.toString()))
                           .toList();
            } else if (x instanceof String str) {
                return parseStringToDoubleList(str);
            }
            return List.of();
        }

        public List<Double> getYAsDoubles() {
            if (y instanceof List<?> list) {
                return list.stream()
                           .map(element -> Double.parseDouble(element.toString()))
                           .toList();
            } else if (y instanceof String str) {
                return parseStringToDoubleList(str);
            }
            return List.of();
        }

        private List<Double> parseStringToDoubleList(String str) {
            String clean = str.trim();
            if (clean.startsWith("[") && clean.endsWith("]")) {
                clean = clean.substring(1, clean.length()-1);
            }

            String[] parts = clean.split(",");
            List<Double> doubles = new ArrayList<>();
            for (String part : parts) {
                doubles.add(Double.parseDouble(part.trim()));
            }
            return doubles;
        }
    }
}
