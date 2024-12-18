import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ categoryData, height, width, xAxisTitle, yAxisTitle, label }) => {
  const colors = [
    '#1F77B4', // Blue (good for neutrality)
    '#FF7F0E', // Orange (bright but balanced)
    '#2CA02C', // Green (pleasant, good contrast)
    '#D62728', // Red (distinguishable, attention-grabbing)
    '#9467BD', // Purple (neutral and calming)
    '#8C564B', // Brown (earthy and neutral)
    '#E377C2', // Pink (adds a soft variation)
    '#7F7F7F', // Gray (good for balance)
    '#BCBD22', // Olive (earthy yellow-green)
    '#17BECF'  // Cyan (adds cool tone balance)
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
    plugins: {
      legend: {
        display: false, // Removes the legend
      },
    },
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
