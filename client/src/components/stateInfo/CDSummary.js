import React, { Component } from "react";
import './CDSummary.css';
import SummaryBoxComponent from './SummaryBoxComponent';

class CDSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAvailable: !!props.data, // Set initial state based on props
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.data1 !== this.props.data1) {
      this.setState({
        dataAvailable: !!this.props.data && !!this.props.data1,
      });
    }
  }

  render() {
    const { dataAvailable } = this.state;

    // Show loading spinner if data is not available
    if (!dataAvailable) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              border: "4px solid #f3f3f3", /* Light gray background */
              borderTop: "4px solid #3498db", /* Blue color for the spinner */
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 2s linear infinite", /* Slower spinner animation */
            }}
          ></div>
        </div>
      );
    }

    if (!this.props.data) {
      return <div className="noData">No data available for the selected district.</div>;
    }

    const { data, data1 } = this.props;

    console.log(data1);

    // window.alert(data1["pctRep"]);
    const summaryBoxes1 = [
      { title: "District ID", content: data.districtId || "N/A" },
      { title: "Vote Margin (%)", content: `${data.voteMarginPercentage.toFixed(2) || 0}%` },
      { title: "Republican %", content: data1.pctRep || "N/A" },
      { title: "Democratic %", content: data1.pctDem || "N/A" },
    ];

    const summaryBoxes2 = [
      { title: "White", content: data1.whitePop || "N/A" },
      { title: "Black", content: data1.blackPop || "N/A" },
      { title: "Hispanic", content: data1.hispanicPop || "N/A" },
      { title: "Asian", content: data1.asianPop || "N/A" },
    ];

    const summaryBoxes3 = [
      { title: "Under $25K", content: data1.incomeDistribution['Under $25K'] || "N/A" },
      { title: "$25K-$50K", content: data1.incomeDistribution['$25K-$50K'] || "N/A" },
      { title: "$50K-$100K", content: data1.incomeDistribution['$50K-$100K'] || "N/A" },
      { title: "$100K-$200K", content: data1.incomeDistribution['$100K-$200K'] || "N/A" },
      { title: "$200K+", content: data1.incomeDistribution['$200K+'] || "N/A" },
    ];

    return (
      <div className="summaryContainer">
        <h3>Quick Facts</h3>
        <hr className="divider" />
        <div className="summaryBoxes">
          {summaryBoxes1.map((box, index) => (
            <SummaryBoxComponent key={index} title={box.title} content={box.content} />
          ))}
        </div>

        <h3>Demographics & Statistics</h3>
        <hr className="divider" />
        <div className="summaryBoxes">
          {summaryBoxes2.map((box, index) => (
            <SummaryBoxComponent key={index} title={box.title} content={box.content} />
          ))}
          <br />
          </div>
          <h3>Income Distribution</h3>
          <hr className="divider" />
          <div className="summaryBoxes">
            {summaryBoxes3.map((box, index) => (
              <SummaryBoxComponent key={index} title={box.title} content={box.content} />
            ))}
          </div>
      </div>
    );
  }
}

export default CDSummary;
