package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeatureDTO {
    private String type = "Feature";
    private Map<String, Object> properties;
    private GeometryDTO geometry;
}
