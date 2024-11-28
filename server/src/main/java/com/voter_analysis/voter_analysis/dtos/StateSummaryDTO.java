package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StateSummaryDTO {
    private String name; // State name
    private long totalPopulation;
    private double pctDem;
    private double pctRep;
    private long prsDem01;
    private long prsRep01;
    private long totVotes;
    private Map<String, Long> racialEthnicPopulation; 
    private long urbanPop;
    private long ruralPop;
    private long suburbanPop;
    private double povertyRate;
    private double medianIncome;
    private Map<String, Long> incomeDistribution; 

}
