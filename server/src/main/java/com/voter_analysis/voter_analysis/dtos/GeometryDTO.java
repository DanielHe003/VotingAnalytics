package com.voter_analysis.voter_analysis.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeometryDTO {
    private String type; // Either "Polygon" or "MultiPolygon"
    private List<?> coordinates; // Nested structure for coordinates


}
