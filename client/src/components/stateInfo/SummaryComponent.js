import React, { Component } from "react";
import ChartContainer from '../common/ChartContainer';

class SummaryBox extends Component {
  render() {
    return (
      <div className="summary-box" style={styles.box}>
        <h3 style={styles.boxTitle}>{this.props.title}</h3>
        <div style={styles.content}>{this.props.content}</div>
      </div>
    );
  }
}

class SummaryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevSelectedTrend: null,
      prevData: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      console.log("selectedTrend has been updated:", this.props.selectedTrend);
    }
    if (prevProps.data !== this.props.data) {
      console.log("Data has been updated:", this.props.data);
    }
  }

  render() {
    const { data, selectedTrend } = this.props;

    return (
      <div className="state-summary" style={styles.container}>
        <div className="main-content" style={styles.mainContent}>
          {/* Left Column: Charts */}
          <div className="charts-column" style={styles.chartsColumn}>
            {selectedTrend === "voting" && (
              <ChartContainer 
                data={{
                  labels: ["Republican Party", "Democratic Party"],
                  values: [data.prsRep01 || 0, data.prsDem01 || 0]
                }} 
                title="Voting Distribution" 
                type="bar" 
                height={300} 
                width={700} 
                label="Party Count"
                xAxisTitle="Party" 
                yAxisTitle="Count"
              />
            )}

            {selectedTrend === "race" && (
              <ChartContainer 
                data={{
                  labels: ["White", "Hispanic", "Black", "Asian", "Others"],
                  values: [
                    data.popWht || 0,
                    data.popHisLat || 0,
                    data.popBlk || 0,
                    data.popAsn || 0,
                    data.popAindalk + data.popHipi + data.popOth + data.popTwoMor || 0
                  ]
                }}
                title="Population by Race" 
                type="bar" 
                height={300} 
                width={700} 
                label="People Count"
                xAxisTitle="Race" 
                yAxisTitle="Population"
              />
            )}

            {selectedTrend === "region" && (
              <ChartContainer 
                data={{
                  labels: ["Urban", "Suburban", "Rural"],
                  values: [data.urban || 0, data.suburban || 0, data.rural || 0]
                }}
                title="Population by Region" 
                type="bar" 
                height={300} 
                width={700} 
                xAxisTitle="Region" 
                yAxisTitle="Population"
                label="Region Type"
              />
            )}

            {selectedTrend === "income" && (
              <ChartContainer 
                data={{
                  labels: ["Below $25K", "$25K–$50K", "$50K–$100K", "$100K–$150K", "Above $150K"],
                  values: [
                    data.less10K21 + data.k10To15K21 + data.k15To20K21 + data.k20To25K21 || 0,
                    data.k25To30K21 + data.k30To35K21 + data.k35To40K21 + data.k40To45K21 + data.k45To50K21 || 0,
                    data.k50To60K21 + data.k60To75K21 + data.k75To100K21 || 0,
                    data.k100To125K21 + data.k125To150K21 || 0,
                    data.k150To200K21 + data.k200KMor21 || 0
                  ]
                }} 
                title="Income Distribution" 
                type="bar" 
                height={300} 
                width={700} 
                xAxisTitle="Income Bracket" 
                yAxisTitle="Population"
                label="Income Threshold"
              />
            )}
          </div>

          {/* Right Column: Summary Boxes */}
          <div className="summary-column" style={styles.summaryColumn}>
            <div className="summary-boxes" style={styles.summaryBoxes}>
                <SummaryBox title="State Population" content={data.totPop.toLocaleString() || "N/A"} />
                  <SummaryBox 
                    title="Average Income" 
                    content={`$${Number(data.mednInc21.toFixed(2) || 0).toLocaleString()}`} 
                  />
                  <SummaryBox 
                    title="People in Poverty" 
                    content={`${data.poverty.toLocaleString() || "N/A"}`} 
                  />
                  <SummaryBox 
                    title="Poverty (%)" 
                    content={`${data.povertyPct.toFixed(2) || "N/A"}%`} 
                  />

                <SummaryBox title="Population Density" content={`${data.density.toFixed(2) || "N/A"}%`} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: "5px",
    boxSizing: "border-box",
  },
  mainContent: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between", // Adds space between the two columns
  },
  chartsColumn: {
    flex: 7, // This will take up 80% of the width
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  },
  summaryColumn: {
    flex: 2, // This will take up 20% of the width
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "30px",
  },
  summaryBoxes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  box: {
    border: "2px solid #005ba6",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "center",
    padding: "7px",
    marginBottom: "20px",
    fontSize: "20px",
    width: "auto",
    maxWidth: "48%",
    minWidth: "210px",
    boxSizing: "border-box",
  },
  boxTitle: {
    backgroundColor: "#005ba6",
    color: "white",
    padding: "6px",
    borderRadius: "4px",
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "20px",
  },
  content: {
    fontSize: "20px",
    textAlign: "center",
  },
};

export default SummaryComponent;
