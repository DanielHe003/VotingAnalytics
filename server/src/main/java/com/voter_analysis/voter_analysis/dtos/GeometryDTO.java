package com.voter_analysis.voter_analysis.dtos;

import java.util.List;

import lombok.Data;

@Data
public class GeometryDTO {
    private String type; // Either "Polygon" or "MultiPolygon"
    private List<?> coordinates; // Nested structure for coordinates


}
