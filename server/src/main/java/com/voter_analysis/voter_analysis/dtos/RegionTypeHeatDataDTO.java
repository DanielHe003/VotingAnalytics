package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegionTypeHeatDataDTO {
    private String precinctKey;
    private String type; // e.g., Urban, Rural, Suburban
    private String color;
}
