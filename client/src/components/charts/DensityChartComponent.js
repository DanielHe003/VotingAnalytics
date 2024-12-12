import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DEFAULT_COLORS = [
  'rgb(13, 110, 253)', 'rgb(214, 51, 132)',
  'rgb(220, 53, 69)', 'rgb(253, 126, 20)', 'rgb(255, 193, 7)', 'rgb(25, 135, 84)',
  'rgb(32, 201, 151)', 'rgb(13, 202, 240)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(108, 117, 125)'
];

const getRandomColor = (index) => {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length] || 'rgb(0, 0, 0)';
};

const mapGroupToCorrectTerm = (group) => {
  const mappingDict = {
    'POP_WHT': 'White',
    'Non POP_WHT': 'Non-White',
    'POP_BLK': 'Black',
    'Non POP_BLK': 'Non-Black',
    'POP_HISLAT': 'Hispanic',
    'Non POP_HISLAT': 'Non-Hispanic',
    'Non POP_ASN': "Non-Asian",
    'POP_ASN': "Asian",
    "LOW_INC": "Low Income",
    "Non LOW_INC": "Non-Low Income",
    "LOW_MID_INC": "Low-Mid Income",
    "Non LOW_MID_INC": "Non Low-Mid Income",
    "UP_MID_INC": "Upper Middle Income",
    "Non UP_MID_INC": "Non-Upper Middle Income",
    "UP_INC": "Upper Income",
    "Non UP_INC": "Non-Upper Income",
  };
  return mappingDict[group] || group;
};

const DensityChartComponent = ({ data, width, height }) => {
  console.log("Input Data:", data);

  if (
    !data ||
    !data.groups ||
    !Array.isArray(data.groups) ||
    data.groups.length === 0 ||
    !data.groups.every(group => group.x.length === group.y.length)
  ) {
    return <p>No valid data provided for the chart.</p>;
  }

  const chartData = {
    datasets: data.groups.map((group, index) => {
      const color = getRandomColor(index);
      return {
        label: `${group.candidateName} (${mapGroupToCorrectTerm(group.group)})`,
        data: group.x.map((xVal, i) => ({ x: xVal, y: group.y[i] })),
        borderColor: color,
        backgroundColor: color.replace('1)', '0.2)'),
        tension: 0.5,
        borderWidth: 2,
        pointRadius: 0,
        fill: true, 
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            family: 'Roboto',
            size: 12
          }
        }
      },
      // title: {
      //   display: true,
      //   text: data.groups.length > 0 ? `Support for ${data.groups[0].candidateName}` : 'Support',
      //   font: {
      //     family: 'Roboto',
      //     size: 25
      //   }
      // },
    },
    scales: {
      x: {
        color: 'black',
        type: "linear",
        title: {
          display: true,
          color: 'black',
          text: mapGroupToCorrectTerm(data.groups[0].group),
          font: {
            family: 'Roboto',
            size: 18,
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
          font: {
            family: 'Roboto',
            size: 14,
          }
        },
        min: 0,
        max: 1,
      },
      y: {
        title: {
          color: 'black',
          display: true,
          text: "Probability Density",
          font: {
            family: 'Roboto',
            size: 16,

          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
          font: {
            family: 'Roboto',
            size: 14,
          }
        }
      },
    },
  };

  return (
    <Line 
      data={chartData} 
      options={chartOptions} 
      width={width} 
      height={height} 
    />
  );
};

export default DensityChartComponent;
