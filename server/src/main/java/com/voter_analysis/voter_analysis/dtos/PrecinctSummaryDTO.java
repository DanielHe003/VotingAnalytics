package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrecinctSummaryDTO {
    // Voter distribution
    private double pctDem;
    private double pctRep;
    private long demVotes;
    private long repVotes;
    private long totalVotes;

    // Racial/Ethnic group population counts
    private long totalPopulation;
    private long whitePop;
    private long blackPop;
    private long hispanicPop;
    private long asianPop;
    private long americanIndianAlaskaNativePop;
    private long hawaiianPacificIslanderPop;
    private long otherPop;
    private long twoOrMorePop;

    // Income distribution (raw values or aggregated)
    private LinkedHashMap<String,Double> incomeDistribution;
    private double medianIncome;
}
