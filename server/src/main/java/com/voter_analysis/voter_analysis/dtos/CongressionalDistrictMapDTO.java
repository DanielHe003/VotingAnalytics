package com.voter_analysis.voter_analysis.dtos;

import java.util.List;

import lombok.Data;

@Data
public class CongressionalDistrictMapDTO {
    private int stateId;
    private int districtId;
    private GeometryDTO geometry;

    @Data
    public static class GeometryDTO {
        private String type; // Polygon or MultiPolygon
        private List<?> coordinates; // Nested array of doubles
    }
}
