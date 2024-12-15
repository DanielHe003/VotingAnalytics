package com.voter_analysis.voter_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.util.List;
import java.util.Map;

// Each document corresponds to one groupName and analysisType for a state
@Data
@Document(collection = "box_whisker_data")
public class BoxWhiskerData {
    @Id
    private String id;

    private int stateId;
    private String analysisType; // "race", "economic", or "region"
    private String groupName; // e.g. "white_pct", "low_income_pct", "urban_population_pct"
    private List<Map<String, String>> data; 
    // data is a list of maps each containing keys: district_id, min, Q1, Q2, Q3, max, points
}
