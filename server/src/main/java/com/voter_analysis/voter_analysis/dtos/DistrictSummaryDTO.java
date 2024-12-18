package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistrictSummaryDTO {
    // Voter distribution
    private double pctDem;
    private double pctRep;
    private long demVotes;
    private long repVotes;
    private long totalVotes;

    // Racial/Ethnic group population (as counts or percentages)
    private long totalPopulation;
    private long whitePop;
    private long blackPop;
    private long hispanicPop;
    private long asianPop;
    private long americanIndianAlaskaNativePop;
    private long hawaiianPacificIslanderPop;
    private long otherPop;
    private long twoOrMorePop;

    // Income distribution (actual numbers or percentages)
    // Here we just return the raw percentages stored in the properties.
    // You can also sum these up to percentages if desired.
    private LinkedHashMap<String, Double> incomeDistribution;
    private double medianIncome;
}
