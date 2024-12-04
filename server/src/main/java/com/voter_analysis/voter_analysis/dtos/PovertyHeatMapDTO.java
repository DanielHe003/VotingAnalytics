package com.voter_analysis.voter_analysis.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PovertyHeatMapDTO {
    private List<PovertyHeatDataDTO> data;
    private Map<String, String> legend;
}
