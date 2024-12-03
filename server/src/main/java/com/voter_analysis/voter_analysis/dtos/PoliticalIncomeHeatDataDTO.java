package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class PoliticalIncomeHeatDataDTO {
    private String precinctKey;
    private double medianIncome;
    private String bin;
    private String color;
    private String dominantParty;
}
