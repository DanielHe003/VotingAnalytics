package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class PovertyHeatData {
    private double povertyPercentage;
    private String bin;
    private String color;
}
