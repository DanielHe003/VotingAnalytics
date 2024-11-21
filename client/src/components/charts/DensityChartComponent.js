// Example Usage
//  const data = {
//   labels: ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"],
//   datasets: [
//     {
//       label: "Indian",
//       data: [0.01, 0.05, 0.2, 0.4, 0.35, 0.15, 0.05, 0.02, 0.01, 0, 0],
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//       borderColor: "rgba(255, 99, 132, 1)",
//       fill: true,
//     },....
// };
  //   <DensityChartComponents
  //     title="Probability Density of Support"
  //     data={data}
  //     width="800px"
  //     height="400px"
  //     xLabel="Support Level"
  //     yLabel="Probability Density"
  //   />
  // </div>

  import React, { Component } from "react";
  import { Line } from "react-chartjs-2";
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
  
  class DensityChartComponent extends Component {
    render() {
      const { title, data, width = "800px", height = "220px", xLabel, yLabel } = this.props;
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: title },
        },
        scales: {
          x: { title: { display: true, text: xLabel } },
          y: { title: { display: true, text: yLabel }, min: 0, max: 0.5 },
        },
        elements: { line: { tension: 0.4 } },
      };
  
      return (
        <div style={{ textAlign: "center", width: width, height: height, margin: "auto", marginTop: "50px" }}>
          <Line data={data} options={options} />
        </div>
      );
    }
  }
  
  export default DensityChartComponent;
  