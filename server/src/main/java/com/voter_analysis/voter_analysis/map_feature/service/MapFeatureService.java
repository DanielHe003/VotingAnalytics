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
        return loadJsonData(state + "_json.json");
    }

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