package com.voter_analysis.voter_analysis.dtos;
import lombok.Data;
import java.util.List;

@Data
public class ScatterPlotDTO<T> {
    private String xAxisLabel; // Label for the x-axis
    private String yAxisLabel; // Label for the y-axis
    private String chartTitle; // Title for the chart
    private List<T> dataPoints; // The actual data points for the chart
}
