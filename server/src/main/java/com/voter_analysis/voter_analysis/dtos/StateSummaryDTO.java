package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StateSummaryDTO {
    private String name; // State name
    private long totalPopulation;
    private double pctDem;
    private double pctRep;
    private long prsDem01;
    private long prsRep01;
    private long totVotes;
    private Map<String, Object> racialEthnicPopulation; 
    private long urbanPop;
    private long ruralPop;
    private long suburbanPop;
    private double povertyRate;
    private double medianIncome;
    private LinkedHashMap<String,Long> incomeDistribution;
    private Map<String, Long> congressionalPartySummary;
    private double populationDensity;  // from state.properties.density
    private String politicalLean;      // derived from pctDem vs pctRep
    private int numberOfDistricts;     // count from db
    private int numberOfPrecincts;     // count from db

}
