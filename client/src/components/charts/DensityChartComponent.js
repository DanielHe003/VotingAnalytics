import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DensityChartComponent = ({ data , width}) => {

  console.log(data)
  // Prepare data for the chart
  const chartData = {
    labels: data.groups[0].x, // Use x-axis values for labels (from the first group)
    datasets: data.groups.map((group, index) => ({
      label: `${group.candidateName} (${group.name})`, // Label for the dataset
      data: group.y, // Use y-axis values for the data points
      borderColor: `rgba(${75 + index * 40}, ${192 - index * 32}, ${192 - index * 32}, 1)`,
      backgroundColor: `rgba(${75 + index * 40}, ${192 - index * 32}, ${192 - index * 32}, 0.2)`,
      pointBackgroundColor: `rgba(${75 + index * 40}, ${192 - index * 32}, ${192 - index * 32}, 1)`,
      tension: 1, // For a smoother line
      pointRadius: 0, // Disable data points
      fill: true // Enable shading below the line
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "X Values",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y Values",
        },
      },
    },
  };

  return (
      <>
      <Line data={chartData} options={chartOptions} />
      </>
  );
};

export default DensityChartComponent;
