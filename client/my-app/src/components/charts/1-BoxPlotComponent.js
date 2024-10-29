// BoxPlot.js
import React from "react";
import { BoxPlot } from "react-chartjs-2"; // Import the BoxPlot component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxPlotElement,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxPlotElement
);

const BoxPlotChart = ({ title, data, width = "800px", height = "400px" }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Groups",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ textAlign: "center", width: width, height: height, margin: "auto", marginTop: "50px" }}>
      <BoxPlot data={data} options={options} />
    </div>
  );
};

export default BoxPlotChart;
