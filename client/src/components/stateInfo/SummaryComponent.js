import React, { Component } from "react";
import ChartContainer from '../common/ChartContainer';
import './SummaryComponent.css';
import SummaryBox from './SummaryBox';

class SummaryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevSelectedTrend: null,
      prevData: null,
      summaryBoxes: [],
      charts: {}
    };
  }

  componentDidUpdate(prevProps) {
    // // Call createValues if selectedTrend or data has changed
    // if (this.props.selectedTrend !== prevProps.selectedTrend || this.props.data !== prevProps.data) {
    //   this.createValues();
    // }
  }


render() {
  const { selectedTrend, tag } = this.props;
  const { data } = this.state; // Assuming 'data' is part of the component's state

  // Define charts only when tag is 'State'
  const charts = tag === "State" ? {
    voting: {
      labels: ["Republican Party", "Democratic Party"],
      values: [data.prsRep01 || 0, data.prsDem01 || 0],
      title: "Voting Distribution",
      xAxisTitle: "Party",
      yAxisTitle: "Count"
    },
    race: {
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
      labels: ["Urban", "Suburban", "Rural"],
      values: [data.urban || 0, data.suburban || 0, data.rural || 0],
      title: "Population by Region",
      xAxisTitle: "Region",
      yAxisTitle: "Population"
    },
    income: {
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
    }
  } : {}; // Return an empty object if tag is not "State"

  // Define summary boxes only when tag is 'State'
  const summaryBoxes = tag === "State" ? [
    { title: "State Population", content: data.totPop.toLocaleString() || "N/A" },
    { title: "Average Income", content: `$${Number(data.mednInc21.toFixed(2) || 0).toLocaleString()}` },
    { title: "People in Poverty", content: `${data.poverty.toLocaleString() || "N/A"}` },
    { title: "Poverty (%)", content: `${data.povertyPct.toFixed(2) || "N/A"}%` },
    { title: "Population Density", content: `${data.density.toFixed(2) || "N/A"}` }
  ] : []; // Return an empty array if tag is not "State"

  return (
    <div className="state-summary container">
      <div className="mainContent">
        {tag === "State" && (
          <>
            <div className="chartsColumn">
              {charts[selectedTrend] && (
                <ChartContainer
                  data={{
                    labels: charts[selectedTrend].labels,
                    values: charts[selectedTrend].values
                  }}
                  title={charts[selectedTrend].title}
                  type="bar"
                  height={300}
                  width={700}
                  titleRender={true}
                  label="Count"
                  xAxisTitle={charts[selectedTrend].xAxisTitle}
                  yAxisTitle={charts[selectedTrend].yAxisTitle}
                />
              )}
            </div>

            <div className="summaryColumn">
              <div className="summaryBoxes">
                {summaryBoxes.map((box, index) => (
                  <SummaryBox key={index} title={box.title} content={box.content} />
                ))}
              </div>
            </div>
          </>
        )}

        {tag === "District" && (
          <>
          asdfasd
            {/* Content for 'District' tag goes here */}
          </>
        )}
      </div>
    </div>
  );
}
}

export default SummaryComponent;