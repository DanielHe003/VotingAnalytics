import React, { Component } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-plugin-trendline";
import regression from "regression";

class ChartScatterPlot extends Component {
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

  renderChart = () => {
    
    // console.log("hi");
    // console.log(this.props.data);
    // console.log(this.props.data['democrats']);


    const chartCanvas = document.getElementById("myChart");
    const democratData = this.props.data['democrats'].map((d) => [d.x, d.y]);
    const republicanData = this.props.data['republicans'].map((d) => [d.x, d.y]);

    const democratRegression = regression.polynomial(democratData, { order: 2 });
    const republicanRegression = regression.polynomial(republicanData, { order: 2 });

    const democratFit = Array.from({ length: 101 }, (_, x) => ({
      x,
      y: democratRegression.equation[0] * Math.pow(x, 2) + democratRegression.equation[1] * x + democratRegression.equation[2],
    }));

    const republicanFit = Array.from({ length: 101 }, (_, x) => ({
      x,
      y: republicanRegression.equation[0] * Math.pow(x, 2) + republicanRegression.equation[1] * x + republicanRegression.equation[2],
    }));

    this.chartInstance = new Chart(chartCanvas, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Democratic Votes",
            data: this.props.data.democrats.map((d) => ({ x: d.x, y: d.y })),
            backgroundColor: "rgba(0, 0, 255, 0.05)",
            borderColor: "blue",
            pointRadius: 1,
            showLine: false,
          },
          {
            label: "Republican Votes",
            data: this.props.data.republicans.map((d) => ({ x: d.x, y: d.y })),
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderColor: "red",
            pointRadius: 1,
            showLine: false,
          },
          {
            label: "Democratic Fit",
            data: democratFit,
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 1)",
            borderWidth: 3,
            pointRadius: 0,
            showLine: true,
          },
          {
            label: "Republican Fit",
            data: republicanFit,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            borderWidth: 3,
            pointRadius: 0,
            showLine: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
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
      <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
        <canvas id="myChart" style={{ width: "1200px", height: "520px" }}></canvas>
      </div>
    );
  }
}

export default ChartScatterPlot;
