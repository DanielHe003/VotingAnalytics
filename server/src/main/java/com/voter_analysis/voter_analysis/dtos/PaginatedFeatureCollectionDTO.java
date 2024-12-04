package com.voter_analysis.voter_analysis.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedFeatureCollectionDTO {
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private FeatureCollectionDTO featureCollection;
}
