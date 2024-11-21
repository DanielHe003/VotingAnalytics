// Example Usage:
// {
//   "Category A": {
//     "District 1": "1,200",
//     "District 2": "1,500",
//     "District 3": "800"
//   },
//   "Category B": {
//     "District 1": "2,300",
//     "District 2": "2,000",
//     "District 3": "1,100"
//   },
//   "Category C": {
//     "District 1": "700",
//     "District 2": "1,400",
//     "District 3": "950"
//   }
// }
// <BarChartComponent categoryData={categoryData} selectedDistrict="District 1" />

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler} from "chart.js";
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const BarChartComponent = ({ categoryData, selectedDistrict, height, width }) => {
  const barData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ""), 10),
  }));

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF5733",
    "#FFC300",
    "#DAF7A6",
    "#900C3F",
    "#581845",
  ];

  const data = {
    labels: barData.map((entry) => entry.name),
    datasets: [
      {
        label: "Count",
        data: barData.map((entry) => entry.value),
        backgroundColor: barData.map(
          (_, index) => colors[index % colors.length]
        ),
        hoverBackgroundColor: barData.map(
          (_, index) => `${colors[index % colors.length]}50`
        ),
        hoverBorderColor: "#0D47A1",
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#1E88E5",
        bodyColor: "#000",
        callbacks: {
          label: (context) => `Count: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
            size: 15,
          },
          maxRotation: 45,
          minRotation: 30,
        },
      },
      y: {
        ticks: {
          font: {
            weight: "bold",
            size: 16,
          },
        },
        grid: {
          color: "#e0e0e0",
        },
      },
    },
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
