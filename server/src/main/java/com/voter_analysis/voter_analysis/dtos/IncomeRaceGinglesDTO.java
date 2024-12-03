package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class IncomeRaceGinglesDTO {
    private String precinctKey;
    private double compositeIndexXaxis; // X-axis: Composite of income and race
    private double democraticVoteShareYaxis; // Y-axis
    private double republicanVoteShareYaxis;
    private String dominantPartyColor; // Dot color
}
