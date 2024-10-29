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
// <PieChartComponent categoryData={categoryData} selectedDistrict="District 1" />

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const getUniqueColor = (index) => {
  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#FF5733", "#FFC300", "#DAF7A6", "#900C3F", "#581845"
  ];
  return colors[index % colors.length];
};

const PieChartComponent = ({ categoryData, selectedDistrict, width = 400, height = 400 }) => {
  const pieData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ''), 10),
  }));

  const data = {
    labels: pieData.map(entry => entry.name),
    datasets: [
      {
        data: pieData.map(entry => entry.value),
        backgroundColor: pieData.map((_, index) => getUniqueColor(index)),
        hoverBackgroundColor: pieData.map((_, index) => getUniqueColor(index)),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartComponent;