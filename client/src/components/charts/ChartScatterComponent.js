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

generateRegressionData = (data, color, label) => {
  if (data.length < 2) {
    return null; // Avoid issues with insufficient data points
  }

  let bestR2 = -Infinity;
  let bestPredictor;

  for (let order = 1; order <= 3; order++) {
    const polynomial = regression.polynomial(data.map((d) => [d.x, d.y]), { order });
    const r2 = polynomial.r2;
    if (r2 > bestR2) {
      bestR2 = r2;
      bestPredictor = polynomial;
    }
  }

  // Generate smooth points
  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));
  const smoothPoints = [];
  const step = (xMax - xMin) / 100; // 100 steps for smoothness

  for (let x = xMin; x <= xMax; x += step) {
    const y = bestPredictor.predict(x)[1];
    smoothPoints.push({ x, y });
  }

  return {
    label: label,
    data: smoothPoints,
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
      y: d.democracticShareYAxis || d.democraticVoteShareYaxis || 0,
    })).filter((d) => d.x !== 0 && d.y !== 0);
    
    const republicanData = data.map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.republicanShareYaxis || d.republicanVoteShareYaxis || 0,
    })).filter((d) => d.x !== 0 && d.y !== 0);
    
    return {
      democraticData,
      republicanData,
    };
  };

  renderChart = () => {
    const chartCanvas = document.getElementById("myChart");
    const { democraticData, republicanData } = this.generateDataForRegression(this.props.data.dataPoints);
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

    datasets.push(this.generateRegressionData(democraticData, "blue", "Democratic Fit"));
    datasets.push(this.generateRegressionData(republicanData, "red", "Republican Fit"));

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
              text: this.props.data.xaxisLabel,
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          y: {
            min: 0,
            max: 100,
            title: {
              display: true,
              text: this.props.data.yaxisLabel,
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
          width={this.props.width} 
          height={this.props.height} 
          style={{ border: '1px solid #ccc' }} 
        ></canvas>
      </div>
    );
  }
}

export default ChartScatterComponent;