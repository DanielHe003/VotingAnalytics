package com.voter_analysis.voter_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

import java.util.Map;

@Data
@Document(collection = "district_plans")
public class DistrictPlan {
    @Id
    private String id; // MongoDB ID

    private int stateId;
    private String category;   // e.g. "enacted", "heavily-rural"
    private Integer planNum;   // e.g. 3120
    @Field("id")
    private String planId;     // The custom 'id' field we assigned (like 'enacted', 'heavilyRural1')
    private String name;       // Friendly name for the plan
    private Map<String, Object> geojson; // The entire GeoJSON for the district plan
}
