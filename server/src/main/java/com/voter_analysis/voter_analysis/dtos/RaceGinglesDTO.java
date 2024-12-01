package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class RaceGinglesDTO {
    private String precinctKey;
    private double raceXAxis; // Racial percentage (X-axis)
    private double partyVoteShareYAxis; // Party vote share (Y-axis)
    private String dominantPartyColor; // Party with the highest vote (dot color)
}
