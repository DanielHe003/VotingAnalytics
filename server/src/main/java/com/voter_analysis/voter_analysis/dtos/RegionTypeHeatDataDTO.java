package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class RegionTypeHeatDataDTO {
    private String precinctKey;
    private String type; // e.g., Urban, Rural, Suburban
    private String color;
}
