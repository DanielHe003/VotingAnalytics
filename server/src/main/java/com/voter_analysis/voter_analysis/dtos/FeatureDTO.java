package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;
import java.util.Map;

@Data
public class FeatureDTO {
    private String type = "Feature";
    private Map<String, Object> properties;
    private GeometryDTO geometry;
}
