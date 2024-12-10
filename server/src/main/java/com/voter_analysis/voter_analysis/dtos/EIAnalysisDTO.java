package com.voter_analysis.voter_analysis.dtos;

import com.voter_analysis.voter_analysis.models.EIAnalysis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EIAnalysisDTO {
    private String candidateName;
    private String group; // group or race name
    private List<Double> x;
    private List<Double> y;

    public static EIAnalysisDTO fromDataEntry(EIAnalysis analysis, EIAnalysis.AnalysisData entry) {
        EIAnalysisDTO dto = new EIAnalysisDTO();
        dto.setCandidateName(analysis.getCandidateName());

        // If race analysis, use `race`; if economic or region, use `group`.
        // Here, we rely on the calling method to know which field to use.
        dto.setGroup(entry.getRace() != null ? entry.getRace() : entry.getGroup());
        dto.setX(entry.getXAsDoubles());
        dto.setY(entry.getYAsDoubles());
        return dto;
    }
}
