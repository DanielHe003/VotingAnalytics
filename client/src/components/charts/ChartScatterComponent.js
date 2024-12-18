import React, { Component } from "react";
import Plot from "react-plotly.js";
import * as d3 from "d3";

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

      const state = this.props.selectedState.toLowerCase(); 
      const trend = this.props.selectedSubTrend.toLowerCase();
      console.log(this.props.selectedSubSubTrend);
      const subTrend = this.props.selectedSubSubTrend ? this.props.selectedSubSubTrend.toLowerCase() : "";
      console.log(trend);
      console.log(subTrend);
      let fileSuffix = "";

      if (trend === "race") {
        fileSuffix = `POP_${subTrend ? subTrend : ""}.csv`;
      } else if (trend === "income") {
        fileSuffix = `income_${
          subTrend ? subTrend.toLowerCase() : ""
        }.csv`.replace(/_$/, ""); 
      } else if (trend === "income-race") {
        fileSuffix = `POP_${
          subTrend ? subTrend.toUpperCase() : "WHT"
        }_income.csv`; // Combine race + income
      } else {
        console.error("Invalid trend selected");
        return;
      }

      const filePath = `${state}_${fileSuffix}`;
      console.log(filePath);
      const values = {
        "california_POP_black_income.csv": {
          "coeff_dem": [-2.39023039696772, 10.992624298776631, 78.31134243937454],
          "coeff_rep": [2.3902303969677487, -10.992624298776638, 21.688657560625376]
        },
        "california_POP_asian.csv": {
          "coeff_dem": [
            -0.0029286993769646707, 0.27820395731579933, 63.6412485447868
          ],
          "coeff_rep": [0.002928699376964671, -0.2782039573158007, 36.35875145521331]
        },
        "california_POP_hispanic_income.csv": {
          "coeff_dem": [1.3922773281162522, 9.369681807937788, 60.73049421322865],
          "coeff_rep": [-1.392277328116246, -9.369681807937775, 39.26950578677128]
        },
        "california_POP_hispanic.csv": {
          "coeff_dem": [0.003856863279341703, -0.1823025771526202, 60.17427866194246],
          "coeff_rep": [-0.003856863279341703, 0.18230257715261922, 39.82572133805763]
        },
        "alabama_POP_white.csv": {
          "coeff_dem": [
            0.0029913935299295735, -0.08920360842625218, 21.821419011098005
          ],
          "coeff_rep": [-0.0029913935299295848, 0.0892036084262538, 78.178580988902]
        },
        "alabama_POP_asian_income.csv": {
          "coeff_dem": [1.8469009604060558, -2.615116238993346, 8.090827230581901],
          "coeff_rep": [-1.846900960406095, 2.615116238993385, 91.90917276941812]
        },
        "california_income_rural.csv": {
          "coeff_dem": [
            3.468854666305271e-10, 1.4212499818418485e-6, 42.03750609889169
          ],
          "coeff_rep": [
            -3.4688546663052554e-10, -1.4212499818417428e-6, 57.962493901108346
          ]
        },
        "alabama_income_rural.csv": {
          "coeff_dem": [
            -1.721069100641593e-9, 0.00015738589180801525, 33.917837569788446
          ],
          "coeff_rep": [
            1.721069100641592e-9, -0.00015738589180801484, 66.08216243021162
          ]
        },
        "alabama_POP_white_income.csv": {
          "coeff_dem": [-5.799685328346074, 2.1344100143715288, 36.18096888863207],
          "coeff_rep": [5.799685328346097, -2.1344100143715172, 63.81903111136789]
        },
        "california_POP_white_income.csv": {
          "coeff_dem": [3.4781034691998705, -0.18081771315614373, 57.14168479872197],
          "coeff_rep": [-3.4781034691998785, 0.18081771315612621, 42.858315201278046]
        },
        "california_POP_white.csv": {
          "coeff_dem": [
            0.0022118688249510954, -0.4253111774291915, 74.10199161455284
          ],
          "coeff_rep": [
            -0.0022118688249510897, 0.42531117742918984, 25.89800838544727
          ]
        },
        "alabama_POP_hispanic.csv": {
          "coeff_dem": [
            0.00535731865950289, -0.21697856179644584, 29.564924244721766
          ],
          "coeff_rep": [-0.005357318659502926, 0.21697856179644753, 70.43507575527822]
        },
        "california_income_.csv": {
          "coeff_dem": [
            3.774816233381215e-10, -6.710876380543318e-5, 66.51510734921243
          ],
          "coeff_rep": [
            -3.774816233381225e-10, 6.710876380543377e-5, 33.48489265078758
          ]
        },
        "alabama_POP_black.csv": {
          "coeff_dem": [
            -0.0016079065105355638, 0.00921950795459355, 29.381438354337494
          ],
          "coeff_rep": [
            0.0016079065105355473, -0.009219507954592263, 70.61856164566247
          ]
        },
        "california_POP_asian_income.csv": {
          "coeff_dem": [-0.7200558953526176, 2.2528653515959793, 69.18757038426511],
          "coeff_rep": [0.720055895352613, -2.2528653515960104, 30.8124296157349]
        },
        "california_POP_black.csv": {
          "coeff_dem": [-0.007979594403433328, 1.0699749781817143, 55.95767179474591],
          "coeff_rep": [0.007979594403433328, -1.0699749781817152, 44.04232820525415]
        },
        "alabama_POP_hispanic_income.csv": {
          "coeff_dem": [-3.7978988182745947, -1.4513768898693091, 29.627740879987574],
          "coeff_rep": [3.7978988182745863, 1.4513768898693515, 70.37225912001252]
        },
        "alabama_income_suburban.csv": {
          "coeff_dem": [
            -1.927081544736184e-10, 5.777541765899561e-7, 13.78857033513476
          ],
          "coeff_rep": [
            1.9270815447361597e-10, -5.777541765890847e-7, 86.21142966486525
          ]
        },
        "alabama_POP_asian.csv": {
          "coeff_dem": [
            0.007950868411827143, -0.41849343243452575, 12.344406505264867
          ],
          "coeff_rep": [-0.00795086841182718, 0.41849343243452863, 87.65559349473509]
        },
        "california_income_suburban.csv": {
          "coeff_dem": [
            4.461609429314462e-10, -9.096058119257745e-5, 66.39063561311109
          ],
          "coeff_rep": [
            -4.461609429314463e-10, 9.096058119257765e-5, 33.60936438688898
          ]
        },
        "california_income_urban.csv": {
          "coeff_dem": [
            7.612409157731643e-10, -0.00014093430858200262, 82.83855505630743
          ],
          "coeff_rep": [
            -7.612409157731647e-10, 0.00014093430858200278, 17.161444943692647
          ]
        },
        "alabama_income_.csv": {
          "coeff_dem": [
            -1.4553355687921783e-9, 0.00012686845305886026, 30.54254503473482
          ],
          "coeff_rep": [
            1.4553355687921752e-9, -0.00012686845305885934, 69.4574549652652
          ]
        },
        "alabama_POP_black_income.csv": {
          "coeff_dem": [-1.7791618391843644, -10.437144024572243, 26.525016128931522],
          "coeff_rep": [1.7791618391843644, 10.437144024572268, 73.47498387106843]
        },
        "alabama_income_urban.csv": {
          "coeff_dem": [
            -6.045130023574757e-9, 0.0010830849662681907, 13.89724652207251
          ],
          "coeff_rep": [
            6.045130023574758e-9, -0.0010830849662681902, 86.1027534779275
          ]
        }
      };

      console.log(values[filePath]);
      
      const regressionData = await this.generateRegressionData(
        `csv/${filePath}`,
        values[filePath]["coeff_rep"],
        "red",
        "Republican Fit"
      );
      
      const regressionData1 = await this.generateRegressionData(
        `csv/${filePath}`,
        values[filePath]["coeff_dem"],
        "blue",
        "Democratic Fit"
      );

      console.log(regressionData);
      console.log(regressionData1);
      this.setState({
        scatterData: [
          {
            x: democraticData.map((d) => d.x),
            y: democraticData.map((d) => d.y),
            type: "scatter",
            mode: "markers",
            name: "Democratic Votes",
            marker: {
              color: "blue",
              size: 6, // Smaller size for less boldness
              opacity: 0.3, // Reduced opacity for a less bold appearance
            },
          },
          {
            x: republicanData.map((d) => d.x),
            y: republicanData.map((d) => d.y),
            type: "scatter",
            mode: "markers",
            name: "Republican Votes",
            marker: {
              color: "red",
              size: 6, // Smaller size for less boldness
              opacity: 0.3, // Reduced opacity for a less bold appearance
            },
          },
          regressionData,
          regressionData1
        ],
      });
    } catch (error) {
      console.error("Error generating chart data", error);
    }
  };

  async generateRegressionData(url, coefficients, color, name) {
    try {
        // Load the CSV data
        const data = await d3.csv(url);

        // Extract the x_fit column and parse the values as floats
        const x = data.map(d => parseFloat(d.x_fit));

        // Calculate y values based on the coefficients
        const [a, b, c] = coefficients;
        const y = x.map((val) => a * val ** 2 + b * val + c);

        // Return the scatter plot data with thicker line
        return {
            x,
            y,
            type: "scatter",
            mode: "lines",
            name,
            line: {
                width: 3, // Adjust the width as needed for thicker lines
                color
            },
        };
    } catch (error) {
        console.error("Error loading CSV data or generating regression data:", error);
    }
}

  
  generateDataForRegression = async (data) => {
    if (!data || !Array.isArray(data)) {
      console.log("Invalid data");
      return { democraticData: [], republicanData: [] };
    }

    const democraticData = data
    .map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.democracticShareYAxis || d.democraticVoteShareYaxis || 0,
    }))
    .filter((d) => d.x !== 0 && d.y !== 0 && d.x !== 100 && d.y !== 100);
  
  const republicanData = data
    .map((d) => ({
      x: d.raceXAxis || d.compositeIndexXaxis || d.medianIncomeXaxis || 0,
      y: d.republicanShareYaxis || d.republicanVoteShareYaxis || 0,
    }))
    .filter((d) => d.x !== 0 && d.y !== 0 && d.x !== 100 && d.y !== 100);
  
    return { democraticData, republicanData };
  };

  render() {
    const { scatterData, regressionData, regressionData1 } = this.state;

    const data = [...scatterData, ...regressionData, ...regressionData1];

    return (
      <div
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`,
        }}
      >
        <Plot
          data={data}
          layout={{
            width: this.props.width,
            height: this.props.height,
            title: this.props.title,
            xaxis: {
              title: this.props.data.xaxisLabel,
              range: [0, null], // Minimum is 0, maximum is auto-determined
            },
            yaxis: {
              title: this.props.data.yaxisLabel,
              range: [0, null], // Minimum is 0, maximum is auto-determined
            },
            
            showlegend: true,
          }}
        />
      </div>
    );
  }
}

export default ChartScatterComponent;


