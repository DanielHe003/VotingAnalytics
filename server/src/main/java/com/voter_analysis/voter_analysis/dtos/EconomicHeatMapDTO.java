package com.voter_analysis.voter_analysis.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EconomicHeatMapDTO {
    private List<EconomicHeatDataDTO> data;
    private Map<String, String> legend;
}
