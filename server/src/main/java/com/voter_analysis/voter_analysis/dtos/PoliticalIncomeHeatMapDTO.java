package com.voter_analysis.voter_analysis.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PoliticalIncomeHeatMapDTO {
    private List<PoliticalIncomeHeatDataDTO> data;
    private Map<String, String> legend;
}
