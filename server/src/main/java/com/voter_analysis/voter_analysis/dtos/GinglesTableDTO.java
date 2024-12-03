package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;
@Data
public class GinglesTableDTO {
    private String precinctKey;
    private double pctDem;
    private double pctRep;
    private long totVotes;
    private long totPop;
    private double medianIncome;
    private double urbanPct;
    private double ruralPct;
    private double suburbanPct;
    private double povertyPct;
}
