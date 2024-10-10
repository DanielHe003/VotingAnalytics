package com.voter_analysis.voter_analysis.analysis_feature.service;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Map;
import java.util.List;

@Service
public class AnalysisFeatureService {

    @Autowired
    private ResourceLoader resourceLoader;

    public Map<String, Object> getPrecinctAnalysis(String state) {
        state = "";
        return loadJsonData( state + "precinct_analysis.json");
    }

    public Map<String, Object> getEcologicalInference(String state, String analysis) {
        return loadJsonData(state + "_" + analysis + ".json");
    }

    // Load demographic voting data for a given state
    public Map<String, Object> getDistrictsData(String state) {
        return loadJsonData("json_" + state + "_data.json");
    }
    public Map<String, Object> getIncomeData(String state) {
        state = "";
        return loadJsonData("map_income_cali.json");
    }

    // Helper method to load JSON data from resources
    private Map<String, Object> loadJsonData(String fileName) {
        try {
            Resource resource = resourceLoader.getResource("classpath:data/" + fileName);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(resource.getInputStream(), Map.class);
        } catch (IOException e) {
            throw new RuntimeException("Error loading JSON data: " + e.getMessage());
        }
    }
}
