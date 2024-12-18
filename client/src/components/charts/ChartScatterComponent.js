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
  
    // Step 1: Prepare the data for fitting a quadratic function
    const n = data.length;
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;
  
    // Calculate the sums needed for the system of equations
    data.forEach((point) => {
      const x = point.x;
      const y = point.y;
  
      sumX += x;
      sumX2 += x * x;
      sumX3 += x * x * x;
      sumX4 += x * x * x * x;
  
      sumY += y;
      sumXY += x * y;
      sumX2Y += x * x * y;
    });
  
    // Step 2: Solve the system of equations to find a, b, and c
    // The system of equations for the quadratic fit is:
    // | n     sumX     sumX2 |   | c |   =   | sumY     |
    // | sumX  sumX2    sumX3 |   | b |   =   | sumXY    |
    // | sumX2 sumX3    sumX4 |   | a |   =   | sumX2Y   |
    
    // Using Cramer's rule to solve for a, b, c
    const denom = n * (sumX2 * sumX4 - sumX3 * sumX3) - sumX * (sumX * sumX4 - sumX2 * sumX3) + sumX2 * (sumX * sumX3 - sumX2 * sumX2);
  
    const a = (sumY * (sumX2 * sumX4 - sumX3 * sumX3) - sumXY * (sumX * sumX4 - sumX2 * sumX3) + sumX2Y * (sumX * sumX3 - sumX2 * sumX2)) / denom;
    
    const b = (n * (sumXY * sumX4 - sumX2Y * sumX3) - sumX * (sumY * sumX4 - sumX2Y * sumX2) + sumX2 * (sumY * sumX3 - sumXY * sumX2)) / denom;
    
    const c = (n * (sumX2 * sumX2Y - sumXY * sumX3) - sumX * (sumX * sumX2Y - sumY * sumX3) + sumX2 * (sumX * sumXY - sumY * sumX2)) / denom;
  
    // Step 3: Generate smooth points using the quadratic equation y = a * x^2 + b * x + c
    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const smoothPoints = [];
    const step = (xMax - xMin) / 1; // More steps for smoothness
  
    for (let x = xMin; x <= xMax; x += step) {
      const y = a * x * x + b * x + c;  // y = a * x^2 + b * x + c
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
    }))
    // .filter((d) => d.x !== 0 && d.y !== 0);
    
    const republicanData = data.map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.republicanShareYaxis || d.republicanVoteShareYaxis || 0,
    }))
    // .filter((d) => d.x !== 0 && d.y !== 0);
    
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
                size: 17, // Increased font size by 10%
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
                size: 17, // Increased font size by 10%
                weight: "bold",
              },
            },
          },
        },
        layout: {
          padding: 22, // Increased padding by 10%
        },
      },
    });
  };

  render() {
    const increasedWidth = this.props.width * 1.1; // Increase width by 10%
    const increasedHeight = this.props.height * 1.1; // Increase height by 10%
    return (
      <div style={{ width: `${increasedWidth}px`, height: `${increasedHeight}px` }}>
        <canvas 
          id="myChart" 
          width={increasedWidth} 
          height={increasedHeight} 
        ></canvas>
      </div>
    );
  }
}

export default ChartScatterComponent;
