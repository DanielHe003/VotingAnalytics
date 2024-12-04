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

  generateRegressionData = (data, color) => {

    const polynomial = regression.polynomial(data.map((d) => [d.x, d.y]), { order: 2 });
    const fitData = data.map((d) => ({
      x: d.x,
      y: polynomial.predict(d.x)[1],
    }));

    return {
      label: "",
      data: fitData,
      borderColor: color,
      backgroundColor: `${color}`,
      borderWidth: 3,
      pointRadius: 0,
      showLine: true,
    };
  };

  generateDataForRegression = (data) => {
    if (!data || !Array.isArray(data)) {
      return { democraticData: [], republicanData: [] };
    }

    const democraticData = data.map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.deomcracticShareYAxis || d.democraticVoteShareYaxis || 0,
    }));

    const republicanData = data.map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.republicanShareYaxis || d.republicanVoteShareYaxis || 0,
    }));

    return {
      democraticData,
      republicanData,
    };
  };

  renderChart = () => {
    const chartCanvas = document.getElementById("myChart");
    const { democraticData, republicanData } = this.generateDataForRegression(this.props.data);
    const datasets = [];

    datasets.push({
      label: "Democratic Votes",
      data: democraticData,
      backgroundColor: "blue",
      borderColor: "blue",
      pointRadius: 0.5,
      showLine: false,
    });
    datasets.push({
      label: "Republican Votes",
      data: republicanData,
      backgroundColor: "red",
      borderColor: "red",
      pointRadius: 0.5,
      showLine: false,
    });
    datasets.push(this.generateRegressionData(democraticData, "blue"));
    datasets.push(this.generateRegressionData(republicanData, "polynomial", "red"));

    this.chartInstance = new Chart(chartCanvas, {
      type: "scatter",
      data: {datasets},
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
              text: this.props.xAxisTitle,
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          y: {
            title: {
              display: true,
              text: this.props.yAxisTitle,
              font: {
                size: 16,
                weight: "bold",
              },
            },
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
        <canvas 
          id="myChart" 
          width={this.props.width - 100} 
          height={this.props.height - 100} 
          style={{ border: '1px solid #ccc' }} 
        ></canvas>
      </div>
    );
  }
}

export default ChartScatterComponent;
