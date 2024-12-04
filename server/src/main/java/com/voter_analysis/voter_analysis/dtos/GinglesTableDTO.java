package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
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
