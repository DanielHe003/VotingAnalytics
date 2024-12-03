package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class DemographicHeatDataDTO {
    private String precinctKey;
    private double percentage;
    private String bin;
    private String color;
}
