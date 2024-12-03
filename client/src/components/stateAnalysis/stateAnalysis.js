import React from "react";
import TopBar from "./TopBar";
import ChartContainer from "../common/ChartContainer";
import axios from "axios";
import "./StateAnalysis.css";

class StateAnalysis extends React.Component {
  state = {
    baseUrl: "http://localhost:8080",
    showPopup: false,
    chartData: null,
  };

  fetchData = async (endpoint) => {
    try {
      const { data } = await axios.get(`${this.state.baseUrl}/${endpoint}`);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  fetchGingles = async () => { 
    /* const data = await this.fetchData("gingles"); this.setState({ chartData: data }); */ 
  };
  fetchSeawulf = async () => { 
    /* const data = await this.fetchData("seawulf"); this.setState({ chartData: data }); */ 
  };
  fetchEIData = async () => { 
    /* const data = await this.fetchData("ei"); this.setState({ chartData: data }); */ 
  };

  renderChart = () => {
    const { selectedTrend } = this.props;
    const { chartData } = this.state;

    if (selectedTrend === "Gingles") {
      return <ChartContainer data={chartData} type="density" title="Gingles Analysis" height={400} width={600} xAxisTitle="X-Axis" yAxisTitle="Y-Axis" />;
    }
    if (selectedTrend === "MCMC") {
      return <ChartContainer data={chartData} type="boxandwhisker" title="MCMC Analysis" height={400} width={600} xAxisTitle="X-Axis" yAxisTitle="Y-Axis" />;
    }
    if (selectedTrend === "EI") {
      return <ChartContainer data={chartData} type="density" title="EI Analysis" height={400} width={600} xAxisTitle="X-Axis" yAxisTitle="Y-Axis" />;
    }
    return null;
  };

  renderSideTable = () => {
    const { selectedTrend } = this.props;
    if (selectedTrend === "Gingles" || selectedTrend === "MCMC" || selectedTrend === "EI") return null;
    return null;
  };

  render() {
    const {
      selectedState, selectedDistrict, selectedTrend, selectedSubTrend,
      setSelectedState, setSelectedDistrict, setSelectedTrend, setSelectedSubTrend
    } = this.props;

    return (
      <>
        <TopBar
          selectedState={selectedState} selectedDistrict={selectedDistrict} selectedTrend={selectedTrend}
          selectedSubTrend={selectedSubTrend} setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict} setSelectedTrend={setSelectedTrend}
          setSelectedSubTrend={setSelectedSubTrend}
        />
        <div className="content-container">
          <div className="map-container">{this.renderChart()}</div>
          {this.renderSideTable() !== null && <div className="chart-container">{this.renderSideTable()}</div>}
        </div>
      </>
    );
  }
}

export default StateAnalysis;