package com.voter_analysis.voter_analysis.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RegionTypeHeatMapDTO {
    private List<RegionTypeHeatDataDTO> data;
    private Map<String, String> legend;
}
