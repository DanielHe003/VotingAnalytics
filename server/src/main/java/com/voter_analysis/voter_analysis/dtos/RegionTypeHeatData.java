package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class RegionTypeHeatData {
    private String type; // e.g., Urban, Rural, Suburban
    private String color;
}
