// Example Usage
// const dataSets = [
//   {
//     data: generateData(50, 0, 100, 40, 70),  
//     label: "Democratic Votes",
//     color: "blue",
//     regressionType: "polynomial",  
//   },.....
// ];

//   <div style={{ padding: "20px", textAlign: "center" }}>
//     <h2>Vote Percentage Analysis</h2>
//     <p>Scatter Plot with Regression Lines for Different Voting Groups</p>
//     <ChartScatterComponent
//       height={500}
//       width={1000}
//       dataSets={dataSets}
//       populationStat="Registered"
//     />
//   </div>

import React, { Component } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-plugin-trendline";
import regression from "regression";

class ChartScatterComponent extends Component {
  chartInstance = null;

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.renderChart();
  }

  componentWillUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  generateRegressionData = (data, regressionType, color) => {
    const regressionMethods = {
      linear: regression.linear,
      polynomial: regression.polynomial,
      exponential: regression.exponential,
      logarithmic: regression.logarithmic,
      power: regression.power,
    };
  
    const regressionFunc = regressionMethods[regressionType] || regression.polynomial;
    const result = regressionFunc(data.map((d) => [d.x, d.y]), { order: 2 });
  
    const fitData = data.map((d) => ({
      x: d.x,
      y: result.predict(d.x)[1],
    }));
  
    return {
      label: "",
      data: fitData,
      borderColor: color,
      backgroundColor: `${color}AA`,
      borderWidth: 3,
      pointRadius: 0,
      showLine: true,
    };
  };
  
  renderChart = () => {
    const chartCanvas = document.getElementById("myChart");
    const datasets = [];

    this.props.dataSets.forEach((dataSet) => {
      const { data, label, color, regressionType } = dataSet;

      datasets.push({
        label,
        data: data.map((d) => ({ x: d.x, y: d.y })),
        backgroundColor: `${color}`,
        borderColor: color,
        pointRadius: 1,
        showLine: false,
      });

      datasets.push(this.generateRegressionData(data, regressionType, color));
    });

    this.chartInstance = new Chart(chartCanvas, {
      type: "scatter",
      data: {
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              filter: (item) => item.text.includes(""),
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `Percentage (%) of ${this.props.populationStat} Voters`,
              font: {
                size: 16,
                weight: "bold",
              },
            },
            min: 0,
            max: 100,
          },
          y: {
            title: {
              display: true,
              text: "Vote Percentage (%)",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            min: 0,
            max: 100,
          },
        },
        layout: {
          padding: 20,
        },
      },
    });
  };

  render() {
    return (
      <div style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}>
        <canvas id="myChart" style={{ width: "1200px", height: "520px" }}></canvas>
      </div>
    );
  }
}

export default ChartScatterComponent;
