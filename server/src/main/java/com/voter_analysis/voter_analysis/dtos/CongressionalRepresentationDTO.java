package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CongressionalRepresentationDTO {
    private int stateId;
    private int districtId; // District number
    private String representative; // Representative's name
    private String party; // Representative's party (e.g., Democrat/Republican)
    private String racialEthnicGroup; // Representative's racial/ethnic group
    private double averageHouseholdIncome; // Median household income
    private double povertyPercentage; // Percentage of population below poverty level
    private double urbanPercentage; // Percentage of population in urban areas
    private double ruralPercentage; // Percentage of population in rural areas
    private double suburbanPercentage; // Percentage of population in suburban areas
    private double voteMarginPercentage; // Vote margin in the selected election
}
