package com.voter_analysis.voter_analysis.sample_feature.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "samplefeature")
public class SampleFeature {

    @Id
    private String id;

    // Add your fields here

    // Constructors, getters, and setters
}
