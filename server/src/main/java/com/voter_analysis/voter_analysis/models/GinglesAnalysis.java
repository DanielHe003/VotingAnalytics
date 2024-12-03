package com.voter_analysis.voter_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import java.util.Map;

@Data
@Document(collection = "gingles_analysis")
public class GinglesAnalysis {

    @Id
    private String id; // MongoDB ID

    private int stateId;

    @Field("precinct_key")
    private String precinctKey;

    @Field("analysis_type")
    private String analysisType;

    @Field("region_type")
    private String regionType;

    private Map<String, Object> data;
}
