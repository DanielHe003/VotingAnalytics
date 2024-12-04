import React from "react";
import TopBar from "./TopBar";
import ChartContainer from "../common/ChartContainer";
import axios from "axios";
import "./StateAnalysis.css";
import ApiService from "../common/ApiService";

class StateAnalysis extends React.Component {
  state = {
    baseUrl: "http://localhost:8080",
    showPopup: false,
    chartData: null,

  };

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props){
      this.fetchGingles();
    }
  }

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
    try {
      if(!this.props.selectedSubSubTrend || !this.props.selectedSubTrend) return;
      const stateId = this.props.selectedState === "Alabama" ? 1 : this.props.selectedState === "California" ? 6 : null;
  
      const urlMap = {
        "race": `states/${stateId}/gingles/race/${this.props.selectedSubSubTrend}`,
        "income": `states/${stateId}/gingles/income${this.props.selectedSubSubTrend ? `?regionType=${this.props.selectedSubSubTrend}` : ""}`,
        "income-race": `states/${stateId}/gingles/income-race/${this.props.selectedSubSubTrend}`
      };
      
      if (urlMap[this.props.selectedSubTrend]) {
        const data = await ApiService.fetchData(`${urlMap[this.props.selectedSubTrend]}`);
        this.setState({ chartData: data });
      }
      
    } catch (error) {
      console.error("Error fetching Gingles analysis:", error);
    }
  };

  // Not implemented
  fetchSeawulf = async () => { 
  };

  fetchEIData = async () => { 
  };

  renderChart = () => {
    if (this.props.selectedTrend === "Gingles") {
      return <ChartContainer data={this.state.chartData} type="scatter" title="Gingles Analysis" height={400} width={700} label="" xAxisTitle="Percentage (%) of _____" yAxisTitle="Vote Percentage (%)" />;
    }
    else if (this.props.selectedTrend === "MCMC") {
      return <ChartContainer data={this.state.chartData} type="boxandwhisker" title="MCMC Analysis" height={400} width={600} xAxisTitle="X-Axis" yAxisTitle="Vote Percentage (%)" />;
    }
    else if (this.props.selectedTrend === "EI") {
      return <ChartContainer data={this.state.chartData} type="density" title="EI Analysis" label={" "} height={400} width={600} xAxisTitle="" yAxisTitle="Vote Percentage (%)" />;
    }
    return null;
  };

  renderSideTable = () => {
    const { selectedTrend } = this.props;
    if (selectedTrend === "Gingles" || selectedTrend === "MCMC" || selectedTrend === "EI") return null;
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
        />
        <div className="content-container">
        <div className="map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {this.renderChart()}
      </div>

          {this.renderSideTable() !== null && <div className="chart-container">{this.renderSideTable()}</div>}
        </div>
      </>
    );
  }
}

export default StateAnalysis;