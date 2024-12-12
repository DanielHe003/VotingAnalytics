import React from "react";
import TopBar from "./TopBar";
import ChartContainer from "../common/ChartContainer";
import axios from "axios";
import "./StateAnalysis.css";
axios.defaults.baseURL = "http://localhost:8080/";

class StateAnalysis extends React.Component {
  state = {
    showPopup: false,
    chartData: null,
    dataAvailable: false,
  };

  componentDidUpdate(prevProps) {
    console.log(this.props.selectedTrend);
    if (prevProps !== this.props) {
      this.setState({ dataAvailable: false , chartData: null});
      console.log("Updated");
      if (this.props.selectedSubSubTrend) {
        if (this.props.selectedSubTrend) {
          if (this.props.selectedTrend === "Gingles") {
            // window.alert("In here");
            this.fetchGingles();
            // this.renderChart();
          } else if (this.props.selectedTrend === "EI") {
            console.log("in ei");
            this.fetchEIData();
            this.renderChart();
          }
        }
      }
    }
  }


  fetchGingles = async () => {
    try {
      if (!this.props.selectedSubSubTrend || !this.props.selectedSubTrend)
        return;

      this.setState({ dataAvailable: false , chartData: null});

      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;

      const urlMap = {
        "race": `states/${stateId}/gingles/race/${this.props.selectedSubSubTrend}`,
        "income": `states/${stateId}/gingles/income${this.props.selectedSubSubTrend ? `?regionType=${this.props.selectedSubSubTrend}`: ""}`,
        "income-race": `states/${stateId}/gingles/income-race/${this.props.selectedSubSubTrend}`,
      };

      if (urlMap[this.props.selectedSubTrend]) {
        const { data } = await axios.get(urlMap[this.props.selectedSubTrend]);
        console.log(urlMap[this.props.selectedSubTrend]);
        console.log(data);
        this.setState({ chartData: data, dataAvailable: true });
      }
    } catch (error) {
      console.error("Error fetching Gingles analysis:", error);
      this.setState({ dataAvailable: false });
    }
  };

  fetchSeawulf = async () => {};

  fetchEIData = async () => {
    try {
      this.setState({ dataAvailable: false, chartData: null });
  
      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;
      
          const regionTypeParam =
          this.props.selectedSubSubSubTrend === "urban" ||
          this.props.selectedSubSubSubTrend === "suburban" ||
          this.props.selectedSubSubSubTrend === "rural"
            ? `&regionType=${this.props.selectedSubSubSubTrend}`
            : "";
              
          window.alert(regionTypeParam);
      const urlMap = {
        racial: `${stateId}/ei-analysis/racial?racialGroup=${this.props.selectedSubSubTrend}&candidateName=`,
        economic: `${stateId}/ei-analysis/economic?&economicGroup=${this.props.selectedSubSubTrend}&candidateName=`,
      };
  
      console.log("map created");
  
      if (urlMap[this.props.selectedSubTrend]) {
        console.log(urlMap[this.props.selectedSubTrend]);
        const bidenUrl = `${urlMap[this.props.selectedSubTrend]}Biden${regionTypeParam}`;
        const trumpUrl = `${urlMap[this.props.selectedSubTrend]}Trump${regionTypeParam}`;
  
        const [bidenData, trumpData] = await Promise.all([
          axios.get(bidenUrl),
          axios.get(trumpUrl),
        ]);
  
        this.setState({
          chartData: { bidenData: bidenData.data, trumpData: trumpData.data },
          dataAvailable: true,
        });
        console.log("Biden Data:", bidenData.data);
        console.log("Trump Data:", trumpData.data);
      }
    } catch (error) {
      console.error("Error fetching EI analysis:", error);
      this.setState({ dataAvailable: false });
    }
  };
  

  renderChart = () => {
    if (!this.state.dataAvailable) {
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
              animation: "spin 1s linear infinite" /* Spinner animation */,
            }}
          ></div>
        </div>
      );
    }

    if (this.props.selectedTrend === "Gingles") {
      if (!this.state.chartData || !this.state.chartData.dataPoints) {
        return <div>No data available</div>;
      }
      return (
        <ChartContainer
          type="scatter"
          data={this.state.chartData}
          height={500}
          width={800}
          label=""
        />
      );
    }

    if (this.props.selectedTrend === "EI") {
      if (!this.state.chartData.bidenData || !this.state.chartData.trumpData) {
        return <div>No data available</div>;
      }
      console.log(this.state.chartData);
      return (

      <ChartContainer
          type="density"
          data={this.state.chartData} 
          height={200}
          width={900}
          label=""
        />
      );
    }

    return null;
  };

  renderSideTable = () => {
    const { selectedTrend } = this.props;
    if (
      selectedTrend === "Gingles" ||
      selectedTrend === "MCMC" ||
      selectedTrend === "EI"
    )
      return null;
    return null;
  };

  render() {
    return (
      <>
        <TopBar
          selectedState={this.props.selectedState}
          selectedDistrict={this.props.selectedDistrict}
          selectedTrend={this.props.selectedTrend}
          selectedSubTrend={this.props.selectedSubTrend}
          setSelectedState={this.props.setSelectedState}
          setSelectedDistrict={this.props.setSelectedDistrict}
          setSelectedTrend={this.props.setSelectedTrend}
          setSelectedSubTrend={this.props.setSelectedSubTrend}
          selectedSubSubTrend={this.props.selectedSubSubTrend}
          setSelectedSubSubTrend={this.props.setSelectedSubSubTrend}
          selectedSubSubSubTrend={this.props.selectedSubSubSubTrend}
          setSelectedSubSubSubTrend={this.props.setSelectedSubSubSubTrend}
        />
        <div className="content-container">
          <div
            className="map-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          {this.renderChart() !== null && (
            <div>{this.renderChart()}</div>
          )}
          </div>

          {this.renderSideTable() !== null && (
            <div className="chart-container">{this.renderSideTable()}</div>
          )}
        </div>
      </>
    );
  }
}

export default StateAnalysis;
