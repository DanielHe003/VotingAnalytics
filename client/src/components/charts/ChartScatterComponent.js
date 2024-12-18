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
    if (data.length < 3) {
      return null; 
    }
  
    const formattedData = data.map(point => [point.x, point.y]);
  
    const result = regression.polynomial(formattedData, { order: 2 });
  
    const coefficients = result.equation; 
    const [a, b, c] = coefficients;
  
    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const smoothPoints = [];
    const step = (xMax - xMin) / 100;  
  
    for (let x = xMin; x <= xMax; x += step) {
      const y = a * x * x + b * x + c;  // y = ax^2 + bx + c
      smoothPoints.push({ x, y });
    }
  
    // Return the chart configuration object
    return {
      label: label,
      data: smoothPoints,
      borderColor: color,
      backgroundColor: `${color}33`, // Add transparency to the background color
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
