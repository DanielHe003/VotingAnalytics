// Example Usage
// const data = [
//   {
//     label: 'District 1',
//     values: [15, 18, 17, 20, 21, 19, 22, 25, 16, 24],
//     color: 'rgba(75, 192, 192, 0.6)', 
//   },
//   {
//     label: 'District 2',
//     values: [10, 14, 13, 15, 16, 18, 14, 17, 13, 19],
//     color: 'rgba(255, 99, 132, 0.6)', 
//   },
//   {
//     label: 'District 3',
//     values: [22, 25, 24, 20, 18, 27, 26, 23, 21, 28],
//     color: 'rgba(54, 162, 235, 0.6)', 
//   }
// ];
// const xAxisTitle = 'Districts';
// const yAxisTitle = 'Values';
// <BoxandWhiskerComponent data={data} xAxisTitle={xAxisTitle} yAxisTitle={yAxisTitle} height={500} width={700} />

import React from 'react';
import Plot from 'react-plotly.js';

const BoxandWhiskerComponent = ({ data, xAxisTitle, yAxisTitle, height = 500, width = 700 }) => {
  const boxPlotData = data.map((district) => ({
    type: 'box',
    y: district.values,
    name: district.label,
    boxpoints: false, 
    marker: {
      color: district.color 
    },
  }));

  const scatterData = data.map((district) => ({
    type: 'scatter',
    mode: 'markers',
    y: district.values,
    x: Array(district.values.length).fill(district.label),
    name: `${district.label} Points`,
    marker: {
      color: district.scatterColor || 'rgba(0, 0, 0, 0.6)',
      size: 6,
    },
  }));

  return (
    <Plot
      data={[...boxPlotData, ...scatterData]}
      layout={{
        title: 'Box Plot with Scatter Overlay',
        yaxis: { title: yAxisTitle },
        xaxis: { title: xAxisTitle },
        boxmode: 'group', 
        height,
        width,
        hovermode: false, 
      }}
      config={{
        displayModeBar: false, 
      }}
    />
  );
};

export default BoxandWhiskerComponent;
