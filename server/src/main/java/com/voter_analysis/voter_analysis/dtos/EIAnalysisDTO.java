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
    
        // Determine which field to use based on the analysisType
        String analysisType = analysis.getAnalysisType();
        String label = null;
    
        if ("race".equalsIgnoreCase(analysisType)) {
            // For race analysis, use the race field
            label = entry.getRace();
        } else if ("economic".equalsIgnoreCase(analysisType)) {
            // For economic analysis, use the group field
            label = entry.getGroup();
        } else if ("region".equalsIgnoreCase(analysisType)) {
            // For region analysis, use the region field
            label = entry.getRegion();
        }
    
        // Fallback if label is still null (e.g., some data errors)
        if (label == null) {
            // If nothing is found, fallback to group or race to avoid null pointer
            // This can be adjusted as per your data integrity assumptions
            label = entry.getRace() != null ? entry.getRace() : entry.getGroup();
            if (label == null) {
                label = entry.getRegion();
            }
        }
    
        dto.setGroup(label);
        dto.setX(entry.getXAsDoubles());
        dto.setY(entry.getYAsDoubles());
    
        return dto;
    }
}
