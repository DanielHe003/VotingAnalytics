package com.voter_analysis.voter_analysis.map_feature.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource; 
import org.springframework.core.io.ResourceLoader; 
import com.fasterxml.jackson.databind.ObjectMapper; 
import org.springframework.stereotype.Service;
import java.io.IOException; 
import java.util.Map; 

@Service
public class MapFeatureService {

    @Autowired
    private ResourceLoader resourceLoader;

    // Load map data for the front home page
    public Map<String, Object> getMap() {
        return loadJsonData("start.json");
    }
    public Map<String, Object> getStateMap(String state){
        return loadJsonData(state + "Json.json");
    }

    // Load state data for a specific state
    public Map<String, Object> getDistrictMap(String state) {
        return loadJsonData(state +  ".json");
    }

    // Load precinct map for a specific state
    public Map<String, Object> getPrecinctMap(String state) {
        return loadJsonData(state + "Precinct.json");
    }

    

    // Load precinct data for overlaying on map
    public Map<String, Object> getPrecinctsData(String state) {
        return loadJsonData(state + "_precincts.json");
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