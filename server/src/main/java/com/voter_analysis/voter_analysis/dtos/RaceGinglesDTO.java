package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RaceGinglesDTO {
    private String precinctKey;
    private double raceXAxis; // Racial percentage (X-axis)
    private double democracticShareYAxis; // Party vote share (Y-axis)
    private double republicanShareYaxis;
    private String dominantPartyColor; // Party with the highest vote (dot color)
}
