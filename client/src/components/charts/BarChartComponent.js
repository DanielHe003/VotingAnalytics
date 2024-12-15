import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ categoryData, height, width, xAxisTitle, yAxisTitle, label }) => {
  const colors = [
    '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#5D6D7E',
    '#2E86C1', '#E74C3C', '#27AE60', '#F1C40F', '#9B59B6', 
  ];
 
  const data = {
    labels: categoryData.labels,
    datasets: [
      {
        label: label,
        data: categoryData.values,
        backgroundColor: colors.slice(0, categoryData.values.length),
        borderColor: colors.slice(0, categoryData.values.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {},
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisTitle,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisTitle,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
