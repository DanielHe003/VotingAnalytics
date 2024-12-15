import React, { Component } from "react";
import ChartContainer from '../common/ChartContainer';
import './CDSummary.css';
import SummaryBox from './SummaryBox';

class CDSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAvailable: !!props.data, // Set initial state based on props
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ dataAvailable: !!this.props.data });
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
              border: "4px solid #f3f3f3" /* Light gray background */,
              borderTop: "4px solid #3498db" /* Blue color for the spinner */,
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 2s linear infinite" /* Slower spinner animation */,
            }}
          ></div>
        </div>
      );
    }

    if (!this.props.data) {
      console.log(this.props.data);
      return <div className="noData">No data available for the selected district.</div>;
    }

    const { data } = this.props;

    const summaryBoxes = [
      { title: "State", content: data.stateId === 1 ? "Alabama" : "California" || "N/A" },
      { title: "District ID", content: data.districtId || "N/A" },
    ];

    const summaryBoxes1 = [
      { title: "Representative", content: data.representative || "N/A" },
      { title: "Representative Party", content: data.party || "N/A" },
      { title: "Racial/Ethnic Group", content: data.racialEthnicGroup || "N/A" },
    ];

    const summaryBoxes2 = [
      { title: "Average Income", content: `$${Number(data.averageHouseholdIncome.toFixed(2) || 0).toLocaleString()}` },
      { title: "Poverty (%)", content: `${data.povertyPercentage.toFixed(2) || 0}%` },
      { title: "Vote Margin (%)", content: `${data.voteMarginPercentage.toFixed(2) || 0}%` },
    ];

    const summaryBoxes3 = [
      { title: "Rural (%)", content: `${data.ruralPercentage.toFixed(2) || 0}%` },
      { title: "Suburban (%)", content: `${data.suburbanPercentage.toFixed(2) || 0}%` },
      { title: "Urban (%)", content: `${data.urbanPercentage.toFixed(2) || 0}%` },
    ];

    return (
      <div className="summaryContainer">
        <h3>General Information</h3>
        <hr className="divider" />
        <div className="summaryBoxes">
          {summaryBoxes.map((box, index) => (
            <SummaryBox key={index} title={box.title} content={box.content} />
          ))}
        </div>

        <h3>Representative Details</h3>
        <hr className="divider" />
        <div className="summaryBoxes">
          {summaryBoxes1.map((box, index) => (
            <SummaryBox key={index} title={box.title} content={box.content} />
          ))}
        </div>

        <h3>Demographics & Statistics</h3>
        <hr className="divider" />
        <div className="summaryBoxes">
          {summaryBoxes2.map((box, index) => (
            <SummaryBox key={index} title={box.title} content={box.content} />
          ))}
          <br />
          {summaryBoxes3.map((box, index) => (
            <SummaryBox key={index} title={box.title} content={box.content} />
          ))}
        </div>
      </div>
    );
  }
}

export default CDSummary;
