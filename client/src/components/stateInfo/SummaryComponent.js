import React, { Component } from "react";
import ChartContainer from '../common/ChartContainer';
import './SummaryComponent.css';
import SummaryBox from './SummaryBox';

class SummaryComponent extends Component {
  
  render() {
    if(this.props.data === null){
      return (
        <></>
      )
    }
    const { data, cdSummaryData, selectedTrend } = this.props;
    console.log(data);
    // window.alert(selectedTrend);
    if(selectedTrend === "") this.props.setSelectedTrend("start");
    const charts = {
      voting: {
        type: "bar",
        labels: ["Republican Party", "Democratic Party"],
        values: [data.prsRep01 || 0, data.prsDem01 || 0],
        title: "Voting Distribution",
        xAxisTitle: "Party",
        yAxisTitle: "Count"
      },
      race: {
        type: "bar",
        labels: ["White", "Hispanic", "Black", "Asian", "Others"],
        values: [
          data.popWht || 0,
          data.popHisLat || 0,
          data.popBlk || 0,
          data.popAsn || 0,
          data.popAindalk + data.popHipi + data.popOth + data.popTwoMor || 0
        ],
        title: "Population by Race",
        xAxisTitle: "Race",
        yAxisTitle: "Population"
      },
      region: {
        type: "bar",
        labels: ["Urban", "Suburban", "Rural"],
        values: [data.urban || 0, data.suburban || 0, data.rural || 0],
        title: "Population by Region",
        xAxisTitle: "Region",
        yAxisTitle: "Population"
      },
      income: {
        type: "bar",
        labels: ["Below $25K", "$25K–$50K", "$50K–$100K", "$100K–$150K", "Above $150K"],
        values: [
          data.less10K21 + data.k10To15K21 + data.k15To20K21 + data.k20To25K21 || 0,
          data.k25To30K21 + data.k30To35K21 + data.k35To40K21 + data.k40To45K21 + data.k45To50K21 || 0,
          data.k50To60K21 + data.k60To75K21 + data.k75To100K21 || 0,
          data.k100To125K21 + data.k125To150K21 || 0,
          data.k150To200K21 + data.k200KMor21 || 0
        ],
        title: "Income Distribution",
        xAxisTitle: "Income Bracket",
        yAxisTitle: "Population"
      },
      districts: {
        title: "Congressional Districts",
        type: "table",
        labels: [
          "District #",
          "Rep. Name",
          "Rep. Party",
          "Avg. Household Income",
          "Poverty %",
          "Urban %",
          "Rural %",
          "Suburban %",
          "Vote Margin %"
      ],
        values: cdSummaryData
    },
      rep: {
        title: "District Representatives",
        type: "table",
        labels: [
          "District #",
          "Rep. Name",
          "Rep. Party",
      ],
        values: cdSummaryData
    }
    
    };

    const ensembleData = {
      title: "State Representatives",
      type: "table",
      labels: ["Ensemble", "# of Plans", "Population Equality Threshold"],
      values: [
        {
          "Ensemble": 0,
          "# of Plans": 250,
          "Population Equality Threshold": 0.5
        },
        {
          "Ensemble": 1,
          "# of Plans": 5000,
          "Population Equality Threshold": 0.5
        }
      ]
    };
        const summaryBoxes = [
      { title: "State Population", content: data.totPop.toLocaleString() || "N/A" },
      { title: "Median Income", content: `$${Number(data.mednInc21.toFixed(2) || 0).toLocaleString()}` },
      { title: "People in Poverty", content: `${data.poverty.toLocaleString() || "N/A"}` },
      { title: "Poverty (%)", content: `${data.povertyPct.toFixed(2) || "N/A"}%` },
      { title: "Population Density", content: `${data.density.toFixed(2) || "N/A"}%` },
      { title: "Political Lean", content: `${this.props.selectedState === "Alabama" ? "Republican" : "Democratic" || "N/A"}` },
      { title: "# of Districts", content: `${ this.props.selectedState === "Alabama" ? "7" : "53" || "N/A"}` },
      { title: "Rep. | Dem. ", content: `${ this.props.selectedState === "Alabama" ? "6 | 1 " : "11 | 42" || "N/A"}` },
      { title: "# of Precincts", content: `${ this.props.selectedState === "Alabama" ? "1971" : "20051" || "N/A"}` }
    ];

    return (
      <div className="state-summary container">
        <div className="mainContent">
          <div className="chartsColumn">

            {charts !== null && charts[selectedTrend] && (
              <ChartContainer
                data={{
                  labels: charts[selectedTrend].labels,
                  values: charts[selectedTrend].values
                }}
                title={charts[selectedTrend].title}
                titleRender={true}
                type={charts[selectedTrend].type}
                height={300}
                width={700}
                label="Count"
                xAxisTitle={charts[selectedTrend].xAxisTitle}
                yAxisTitle={charts[selectedTrend].yAxisTitle}
              />
            )}
          </div>

         
          {this.props.selectedTrend === "start" && (
  <>
    {/* Summary Boxes on their own line */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
      {summaryBoxes.map((box, index) => (
        <SummaryBox key={index} title={box.title} content={box.content} />
      ))}
    </div>

    {/* Chart Container on a new line */}
    <div style={{ marginTop: '20px' }}>
      <ChartContainer
        title="Ensemble Summary"
        height={300}
        width={1000}
        titleRender={true}
        type="table"
        data={{
          values: ensembleData.values,
          labels: ensembleData.labels
        }}
        xAxisTitle={ensembleData.xAxisTitle}
        yAxisTitle={ensembleData.yAxisTitle}
      />
    </div>
  </>
)}


 
        </div>
      </div>
    );
  }
}

export default SummaryComponent;