package com.voter_analysis.voter_analysis.dtos;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import lombok.AllArgsConstructor;
@AllArgsConstructor
@Data
@NoArgsConstructor
public class ScatterPlotDTO<T> {
    private String xAxisLabel; // Label for the x-axis
    private String yAxisLabel; // Label for the y-axis
    private String chartTitle; // Title for the chart
    private List<T> dataPoints; // The actual data points for the chart

}
