package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EconomicHeatDataDTO {
    private String precinctKey;
    private double medianIncome;
    private String bin;
    private String color;
}