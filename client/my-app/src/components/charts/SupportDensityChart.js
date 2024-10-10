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

const SupportDensityChart = ({data}) => {
  // const colors = {
  //   White: {
  //     border: "orange",
  //     background: "rgba(255, 165, 0, 0.3)"
  //   },
  //   Black: {
  //     border: "purple",
  //     background: "rgba(128, 0, 128, 0.3)"
  //   },
  //   Hispanic: {
  //     border: "green",
  //     background: "rgba(0, 255, 0, 0.3)"
  //   },
  //   Asian: {
  //     border: "red",
  //     background: "rgba(255, 0, 0, 0.3)"
  //   }
  // };

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
        <Line data={data.Trump} options={options} />
      </div>

      {/* Chart for Biden */}
      <div style={{ textAlign: "center", width: "800px", height: "220px", margin: "auto", marginTop: "50px" }}>
        <h3>Support for Biden by Racial/Ethnic Groups</h3>
        <Line data={data.Biden} options={options} />
      </div>
    </div>
  );
};

export default SupportDensityChart;
