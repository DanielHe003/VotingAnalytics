// import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = ({ title, data, width = "800px", height = "220px", xLabel, yLabel }) => {
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: title,
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: xLabel,
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: yLabel,
//         },
//         min: 0,
//         max: 0.5, // Adjust this as needed based on your data
//       },
//     },
//   };

//   return (
//     <div style={{ textAlign: "center", width: width, height: height, margin: "auto", marginTop: "50px" }}>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default LineChart;
