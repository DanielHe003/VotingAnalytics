package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;
import java.util.List;

@Data
public class FeatureCollectionDTO {
    private String type = "FeatureCollection";
    private List<FeatureDTO> features;
}
