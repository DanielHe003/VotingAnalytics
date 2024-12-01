package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;
import java.util.List;
import java.util.Map;
@Data
public class PaginatedFeatureCollectionDTO {
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private FeatureCollectionDTO featureCollection;
    private Map<String, Map<String, String>> legends; // Legends for heat maps
}
