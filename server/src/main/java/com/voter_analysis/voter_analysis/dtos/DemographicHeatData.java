package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class DemographicHeatData {
    private double percentage;
    private String bin;
    private String color;
}
