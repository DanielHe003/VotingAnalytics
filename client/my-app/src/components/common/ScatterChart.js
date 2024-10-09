import React, { useEffect } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-plugin-trendline"; // Ensure this plugin is installed
import regression from "regression";

const ChartScatterPlot = ({ data }) => {
  useEffect(() => {
    const chartCanvas = document.getElementById("myChart");
    if (chartCanvas.chartInstance) {
      chartCanvas.chartInstance.destroy();
    }

    // Prepare data for regression
    const democratData = data.democrats.map((d) => [d.x, d.y]);
    const republicanData = data.republicans.map((d) => [d.x, d.y]);

    // Perform polynomial regression (2nd degree)
    const democratRegression = regression.polynomial(democratData, { order: 2 });
    const republicanRegression = regression.polynomial(republicanData, { order: 2 });

    // Generate points for the fitted polynomial line
    const democratFit = Array.from({ length: 101 }, (_, x) => ({
      x,
      y: democratRegression.equation[0] * Math.pow(x, 2) + democratRegression.equation[1] * x + democratRegression.equation[2],
    }));

    const republicanFit = Array.from({ length: 101 }, (_, x) => ({
      x,
      y: republicanRegression.equation[0] * Math.pow(x, 2) + republicanRegression.equation[1] * x + republicanRegression.equation[2],
    }));

    const chartInstance = new Chart(chartCanvas, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Democratic Votes",
            data: data.democrats.map((d) => ({ x: d.x, y: d.y })),
            backgroundColor: "rgba(0, 0, 255, 0.05)",
            borderColor: "blue",
            pointRadius: 1,
            showLine: false, // Points only, no line
          },
          {
            label: "Republican Votes",
            data: data.republicans.map((d) => ({ x: d.x, y: d.y })),
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderColor: "red",
            pointRadius: 1,
            showLine: false, // Points only, no line
          },
          {
            label: "Democratic Fit",
            data: democratFit,
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 1)",
            borderWidth: 3,
            pointRadius: 0, // Do not show points for the fit line
            showLine: true, // Show trendline
          },
          {
            label: "Republican Fit",
            data: republicanFit,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            borderWidth: 3,
            pointRadius: 0, // Do not show points for the fit line
            showLine: true, // Show trendline
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
              text: "Percentage (%) of POP_BLK Voters",
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

    chartCanvas.chartInstance = chartInstance;

    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <canvas id="myChart" style={{ width: "1200px", height: "520px" }}></canvas>
    </div>
  );
};

export default ChartScatterPlot;
