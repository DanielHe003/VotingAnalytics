package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoxWhiskerDataDTO {
    private String districtId;
    private double min;
    private double Q1;
    private double Q2;
    private double Q3;
    private double max;
    private double points;
}
