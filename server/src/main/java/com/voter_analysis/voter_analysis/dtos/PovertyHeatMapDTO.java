package com.voter_analysis.voter_analysis.dtos;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class PovertyHeatMapDTO {
    private List<PovertyHeatDataDTO> data;
    private Map<String, String> legend;
}
