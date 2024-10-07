import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SupportDensityChart = () => {
  // Define common colors for racial/ethnic groups
  const colors = {
    White: {
      border: "orange",
      background: "rgba(255, 165, 0, 0.3)"
    },
    Black: {
      border: "purple",
      background: "rgba(128, 0, 128, 0.3)"
    },
    Hispanic: {
      border: "green",
      background: "rgba(0, 255, 0, 0.3)"
    },
    Asian: {
      border: "red",
      background: "rgba(255, 0, 0, 0.3)"
    }
  };

  // Data for Trump
  const trumpData = {
    labels: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    datasets: [
      {
        label: "White",
        data: [0.01, 0.03, 0.1, 0.2, 0.3, 0.35, 0.3, 0.2, 0.1, 0.05, 0.02],
        borderColor: colors.White.border,
        backgroundColor: colors.White.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Black",
        data: [0.01, 0.02, 0.04, 0.05, 0.1, 0.15, 0.1, 0.05, 0.02, 0.01, 0],
        borderColor: colors.Black.border,
        backgroundColor: colors.Black.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Hispanic",
        data: [0.02, 0.04, 0.1, 0.15, 0.25, 0.35, 0.25, 0.15, 0.1, 0.05, 0.01],
        borderColor: colors.Hispanic.border,
        backgroundColor: colors.Hispanic.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Asian",
        data: [0.01, 0.03, 0.05, 0.1, 0.2, 0.3, 0.2, 0.15, 0.1, 0.05, 0.01],
        borderColor: colors.Asian.border,
        backgroundColor: colors.Asian.background,
        fill: true,
        tension: 0.4,
      },
    ]
  };

  // Data for Biden
  const bidenData = {
    labels: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    datasets: [
      {
        label: "White",
        data: [0.01, 0.03, 0.08, 0.15, 0.2, 0.3, 0.35, 0.25, 0.15, 0.1, 0.05],
        borderColor: colors.White.border,
        backgroundColor: colors.White.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Black",
        data: [0.05, 0.1, 0.15, 0.3, 0.35, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02],
        borderColor: colors.Black.border,
        backgroundColor: colors.Black.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Hispanic",
        data: [0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02],
        borderColor: colors.Hispanic.border,
        backgroundColor: colors.Hispanic.background,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Asian",
        data: [0.01, 0.03, 0.05, 0.1, 0.2, 0.35, 0.3, 0.2, 0.1, 0.05, 0.02],
        borderColor: colors.Asian.border,
        backgroundColor: colors.Asian.background,
        fill: true,
        tension: 0.4,
      },
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Support Density by Racial/Ethnic Groups",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Support Percentage',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Probability Density',
        },
        min: 0,
        max: 0.5,
      },
    },
  };

  return (
    <div>
      {/* Chart for Trump */}
      <div style={{ textAlign: "center", width: "800px", height: "220px", margin: "auto", marginTop: "50px" }}>
        <h3>Support for Trump by Racial/Ethnic Groups</h3>
        <Line data={trumpData} options={options} />
      </div>

      {/* Chart for Biden */}
      <div style={{ textAlign: "center", width: "800px", height: "220px", margin: "auto", marginTop: "50px" }}>
        <h3>Support for Biden by Racial/Ethnic Groups</h3>
        <Line data={bidenData} options={options} />
      </div>
    </div>
  );
};

export default SupportDensityChart;
