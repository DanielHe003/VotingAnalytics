package com.voter_analysis.voter_analysis.analysis_feature.controller;

import com.voter_analysis.voter_analysis.analysis_feature.service.AnalysisFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/{state}/analysis")
public class AnalysisFeatureController {

    @Autowired
    private AnalysisFeatureService analysisFeatureService;

    /**
     * Retrieve precinct analysis data based on race for the specified state.
     *
     * @param state   The state for which precinct analysis is retrieved.
     * @param analysis The type of analysis (e.g., "precinct-analysis").
     * @return AnalysisResponse as a JSON object
     */
    @GetMapping("/precinct-analysis")
    public ResponseEntity<Map<String, Object>> getPrecinctAnalysis(
            @PathVariable String state,
            @RequestParam(name = "analysis", defaultValue = "precinct-analysis") String analysis) {
        
        Map<String, Object> analysisData = analysisFeatureService.getPrecinctAnalysis(state);
        return ResponseEntity.ok(analysisData);
    }

    /**
     * Get ecological inference data based on the precinct analysis for the specified state.
     *
     * @param state    The state for which ecological inference is retrieved.
     * @param analysis The type of analysis related to precincts.
     * @return EcologicalInferenceResponse as a JSON object
     */
    @GetMapping("/ecological-inference")
    public ResponseEntity<Map<String, Object>> getEcologicalInference(
            @PathVariable String state,
            @RequestParam(name = "analysis", defaultValue = "ecological-inference") String analysis) {
        
        Map<String, Object> ecologicalData = analysisFeatureService.getEcologicalInference(state, analysis);
        return ResponseEntity.ok(ecologicalData);
    }
    @GetMapping("/districts/data")
    public ResponseEntity<Map<String, Object>> getDistrictsData(@PathVariable String state) {
        Map<String, Object> districtsData = analysisFeatureService.getDistrictsData(state);
        return ResponseEntity.ok(districtsData);
    }
    @GetMapping("/income")
    public ResponseEntity<Map<String, Object>> getIncomeData(@PathVariable String state) {
        Map<String, Object> incomeData = analysisFeatureService.getIncomeData(state);
        return ResponseEntity.ok(incomeData);
    }
}
