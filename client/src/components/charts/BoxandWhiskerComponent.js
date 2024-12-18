import React, { Component } from "react";
import Plot from "react-plotly.js";
import * as d3 from 'd3';

class ChartScatterComponent extends Component {
  state = {
    scatterData: [],
    regressionData: [],
    regressionData1: [],
  };

  componentDidMount() {
    this.generateData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.generateData();
    }
  }

  generateData = async () => {
    try {
      const { democraticData, republicanData } = await this.generateDataForRegression(this.props.data.dataPoints);
      
    //   const regressionData = await this.generateRegressionData('./csv/alabama_POP_WHT.csv', "red", "Republican Fit");
    //   const regressionData1 = await this.generateRegressionData('./csv/alabama_POP_WHT.csv', "blue", "Democratic Fit");
      
      this.setState({
        scatterData: [
          {
            x: democraticData.map(d => d.x),
            y: democraticData.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Democratic Votes',
            marker: { color: 'blue' },
          },
          {
            x: republicanData.map(d => d.x),
            y: republicanData.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            name: 'Republican Votes',
            marker: { color: 'red' },
          },
        ],
        // regressionData: regressionData ? [regressionData] : [],
        // regressionData1: regressionData1 ? [regressionData1] : [],
      });
    } catch (error) {
      console.error("Error generating chart data", error);
    }
  };

  generateRegressionData = async (data, color, label) => {
    try {
      const response = await d3.csv(data);
      const parsedData = response.map(row => ({
        x: parseFloat(row.x_fit),
        y: row.label === 'Democratic Fit' ? parseFloat(row.y_fit_dem) : parseFloat(row.y_fit_rep),
      }));

      if (parsedData.length < 3) {
        console.log("Not enough data points to perform regression.");
        return null;
      }

      let n = parsedData.length;
      let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
      let sumY = 0, sumXY = 0, sumX2Y = 0;

      parsedData.forEach(point => {
        let x = point.x;
        let y = point.y;
        let x2 = x * x;
        let x3 = x * x2;
        let x4 = x2 * x2;
        
        sumX += x;
        sumX2 += x2;
        sumX3 += x3;
        sumX4 += x4;
        sumY += y;
        sumXY += x * y;
        sumX2Y += x2 * y;
      });

      let A = [
        [sumX4, sumX3, sumX2],
        [sumX3, sumX2, sumX],
        [sumX2, sumX, n]
      ];

      let B = [sumX2Y, sumXY, sumY];

      let coefficients = this.solveSystemOfEquations(A, B);
      if (!coefficients) {
        console.log("Unable to solve for coefficients.");
        return null;
      }

      let [a, b, c] = coefficients;

      const regressionPoints = parsedData.map(point => {
        const y = a * point.x * point.x + b * point.x + c;
        return { x: point.x, y };
      });

      return {
        x: regressionPoints.map(p => p.x),
        y: regressionPoints.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        name: label,
        line: { color },
      };
    } catch (error) {
      console.log("Error generating regression data:", error.message);
      return null;
    }
  };

  solveSystemOfEquations(A, B) {
    const n = A.length;
    let augmentedMatrix = A.map((row, i) => [...row, B[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
          maxRow = j;
        }
      }
      
      [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];

      for (let j = i + 1; j < n + 1; j++) {
        augmentedMatrix[i][j] /= augmentedMatrix[i][i];
      }

      for (let j = i + 1; j < n; j++) {
        let factor = augmentedMatrix[j][i];
        for (let k = i; k < n + 1; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }

    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augmentedMatrix[i][n];
      for (let j = i + 1; j < n; j++) {
        x[i] -= augmentedMatrix[i][j] * x[j];
      }
    }

    return x;
  }

  generateDataForRegression = async (data) => {
    if (!data || !Array.isArray(data)) {
      console.log('Invalid data');
      return { democraticData: [], republicanData: [] };
    }

    const democraticData = data.map(d => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.democracticShareYAxis || d.democraticVoteShareYaxis || 0,
    })).filter(d => d.x !== 0 && d.y !== 0);
    
    const republicanData = data
      .map(d => ({
        x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
        y: d.republicanShareYaxis || d.republicanVoteShareYaxis || 0,
      }))
      .filter(d => d.x !== 0 && d.y !== 0);

    return { democraticData, republicanData };
  };

  render() {
    const { scatterData, regressionData, regressionData1 } = this.state;
    
    const data = [...scatterData, ...regressionData, ...regressionData1];

    return (
      <div style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}>
        <Plot
          data={data}
          layout={{
            width: this.props.width,
            height: this.props.height,
            title: "Vote Share Scatter Plot",
            xaxis: {
              title: this.props.data.xaxisLabel,
            },
            yaxis: {
              title: this.props.data.yaxisLabel,
              range: [0, 100],
            },
            showlegend: true,
          }}
        />
      </div>
    );
  }
}

export default ChartScatterComponent;
