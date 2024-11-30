package com.voter_analysis.voter_analysis.dtos;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class PaginatedResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private Map<String, Map<String, String>> legends; // Legends for multiple heat map types

    public PaginatedResponse(
            List<T> content,
            int pageNumber,
            int pageSize,
            long totalElements,
            int totalPages,
            Map<String, Map<String, String>> legends) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.legends = legends;
    }
}
