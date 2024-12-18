import React from 'react';
import Plot from 'react-plotly.js';

const BoxandWhiskerComponent = ({ title, data, height, width }) => {
    // Extract data for box plot and scatter plot
    const boxData = data.map((district, index) => ({
        type: 'box',
        y: [district.min, district.q1, district.q2, district.q3, district.max], // Box plot data
        name: `${index + 1}`, // Legend and x-axis label
        boxpoints: false, // Disable individual points
        line: {
            color: 'black',
            width: 1
        },
        marker: {
            color: 'rgba(0, 0, 0, 0.5)'
        },
        showlegend: false
    }));

    const scatterData = {
        type: 'scatter',
        mode: 'markers',
        x: data.map((_, index) => `${index + 1}`), // X-axis labels
        y: data.map((district) => district.points), // Scatter data (enacted points)
        name: 'Enacted Plan',
        marker: {
            color: 'red',
            size: 10
        }
    };

    // Combine box-and-whisker and scatter data
    const plotData = [...boxData, scatterData];

    // Calculate x-axis range dynamically
    const xMin = Math.min(...data.map((_, index) => index + 1)); // Smallest index
    const xMax = Math.max(...data.map((_, index) => index + 1)); // Largest index

    return (
        <Plot
            data={plotData}
            layout={{
                title: title,
                height: height || 500,
                width: width || 800,
                xaxis: {
                    title: 'Indexed Districts',
                    tickangle: -45,
                    tickmode: 'linear', // Ensure every tick is shown
                    range: [xMin - 0.5, xMax + 0.5] // Adjust range to include all data points comfortably
                },
                yaxis: {
                    // title: 'Data Value'
                },
                showlegend: true,
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    xanchor: 'center',
                    y: -0.2
                }
            }}
            config={{
                responsive: true,
                // displayModeBar: false // Turn off the feature bar
            }}
        />
    );
};

export default BoxandWhiskerComponent;
