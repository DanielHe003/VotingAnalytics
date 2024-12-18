import React from "react";
import Plot from "react-plotly.js";

// Default colors
const DEFAULT_COLORS = [
  "rgb(13, 110, 253)", "rgb(214, 51, 132)", "rgb(220, 53, 69)",
  "rgb(253, 126, 20)", "rgb(255, 193, 7)", "rgb(25, 135, 84)",
  "rgb(32, 201,151)", "rgb(13, 202, 240)", "rgb(108, 117, 125)"
];

// Generate semi-transparent colors for shading
const getTransparentColor = (color, opacity = 0.3) => {
  return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
};

// Group name mapping
const mapGroupToCorrectTerm = (group) => {
  const mappingDict = {
    "POP_WHT": "White", "Non POP_WHT": "Non-White",
    "POP_BLK": "Black", "Non POP_BLK": "Non-Black",
    "POP_HISLAT": "Hispanic", "Non POP_HISLAT": "Non-Hispanic",
    "Non POP_ASN": "Non-Asian", "POP_ASN": "Asian",
    "LOW_INC": "Low Income", "Non LOW_INC": "Non-Low Income",
    "LOW_MID_INC": "Low-Mid Income", "Non LOW_MID_INC": "Non Low-Mid Income",
    "UP_MID_INC": "Upper Middle Income", "Non UP_MID_INC": "Non-Upper Middle Income",
    "UP_INC": "Upper Income", "Non UP_INC": "Non-Upper Income",
  };
  return mappingDict[group] || group;
};

const DensityChartComponent = ({ data, width = 900, height = 700 }) => {
  console.log("Input Data:", data);

  if (
    !data ||
    !data.groups ||
    !Array.isArray(data.groups) ||
    data.groups.length === 0 ||
    !data.groups.every((group) => group.x.length === group.y.length)
  ) {
    return <p>No valid data provided for the chart.</p>;
  }

  const traces = data.groups.map((group, index) => {
    const color = DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    const transparentColor = getTransparentColor(color, 0.3);

    const extendedX = [
      group.x[0],
      ...group.x,
      group.x[group.x.length - 1],
    ];
    const extendedY = [
      0,
      ...group.y.map((y) => Math.min(100, y <= 0.1 ? 0 : y)), // Cap y values at 100
      0,
    ];

    return {
      x: extendedX,
      y: extendedY,
      type: "scatter",
      mode: "lines",
      fill: "tozeroy",
      line: {
        color: color,
        width: 2,
      },
      fillcolor: transparentColor,
      name: `${group.candidateName} (${mapGroupToCorrectTerm(group.group)})`,
    };
  });

  const layout = {
    xaxis: {
      title: {
        text: "Support Range",
        font: { family: "Roboto", size: 18 },
      },
      range: [0, 1],
      tickfont: { family: "Roboto", size: 14 },
    },
    yaxis: {
      title: {
        text: "Probability Density",
        font: { family: "Roboto", size: 18 },
      },
      range: [0, 100],
      tickfont: { family: "Roboto", size: 14 },
    },
    legend: {
      font: { family: "Roboto", size: 12 },
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.1, // Legend positioned above the chart
    },
    width: width,
    height: height,
    margin: {
      l: 60,
      r: 30,
      t: 5, // Increased top margin to make space for the legend
      b: 50,
    },
    plot_bgcolor: "white",
  };

  return <Plot data={traces} layout={layout} />;
};

export default DensityChartComponent;
