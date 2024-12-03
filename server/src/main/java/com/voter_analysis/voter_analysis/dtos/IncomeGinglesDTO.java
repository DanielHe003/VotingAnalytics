package com.voter_analysis.voter_analysis.dtos;
import lombok.Data;
@Data
public class IncomeGinglesDTO {
    private String precinctKey;
    private double medianIncomeXaxis; // X-axis
    private double democraticVoteShareYaxis;
    private double republicanVoteShareYaxis;// Y-axis
    private String dominantPartyColor; // Dot color
    private String regionType ;
}

