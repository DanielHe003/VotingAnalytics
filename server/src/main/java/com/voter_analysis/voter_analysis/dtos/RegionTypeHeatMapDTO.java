package com.voter_analysis.voter_analysis.dtos;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class RegionTypeHeatMapDTO {
    private List<RegionTypeHeatDataDTO> data;
    private Map<String, String> legend;
}
