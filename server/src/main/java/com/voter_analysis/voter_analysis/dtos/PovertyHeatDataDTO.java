package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PovertyHeatDataDTO {
    private String precinctKey;
    private double povertyPercentage;
    private String bin;
    private String color;
}
