package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistrictPlanDTO {
    private String planId; // The unique identifier for the plan (like enacted or heavilyRural1)
    private String name;   // The friendly name of the plan
    private Integer planNum; // Optional: the numeric plan number if available
    private String category; // e.g. 'heavily-rural', 'enacted'

}
