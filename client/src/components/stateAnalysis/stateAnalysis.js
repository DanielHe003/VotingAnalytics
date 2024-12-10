import React from "react";
import TopBar from "./TopBar";
import ChartContainer from "../common/ChartContainer";
import axios from "axios";
import "./StateAnalysis.css";
import ApiService from "../common/ApiService";
axios.defaults.baseURL = 'http://localhost:8080/';


class StateAnalysis extends React.Component {
  state = {
    baseUrl: "http://localhost:8080",
    showPopup: false,
    chartData: null,
    dataAvailable: false,
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
      if (!this.props.selectedSubSubTrend || !this.props.selectedSubTrend) return;
  
      this.setState({ dataAvailable: false });
  
      const stateId = this.props.selectedState === "Alabama" ? 1 :
                      this.props.selectedState === "California" ? 6 : null;
  
      const urlMap = {
        "race": `states/${stateId}/gingles/race/${this.props.selectedSubSubTrend}`,
        "income": `states/${stateId}/gingles/income${this.props.selectedSubSubTrend ? `?regionType=${this.props.selectedSubSubTrend}` : ""}`,
        "income-race": `states/${stateId}/gingles/income-race/${this.props.selectedSubSubTrend}`
      };
  
      if (urlMap[this.props.selectedSubTrend]) {
        const { data } = await axios.get(urlMap[this.props.selectedSubTrend]);
        this.setState({ chartData: data, dataAvailable: true }); // Set dataAvailable to true after fetching data
      }
    } catch (error) {
      console.error("Error fetching Gingles analysis:", error);
      this.setState({ dataAvailable: true }); // Set to true even in case of error to prevent indefinite loading
    }
  };  
  
  
  // Not implementedcdSummaryData
  fetchSeawulf = async () => { 
  };

  fetchEIData = async () => { 
    try {
      if (!this.props.selectedSubSubTrend || !this.props.selectedSubTrend) return;
  
      this.setState({ dataAvailable: false });
  
      const stateId = this.props.selectedState === "Alabama" ? 1 :
                      this.props.selectedState === "California" ? 6 : null;
  
      const urlMap = {
        "racial": `${stateId}/ei-analysis/racial/?racialGroup=${this.props.selectedSubTrend}&candidateName=${this.props.selectedSubSubTrend}`,
        "economic": `${stateId}/ei-analysis/economic?economicGroup=${this.props.selectedSubTrend}&candidateName=${this.props.selectedSubSubTrend}`,
        "region": `${stateId}/ei-analysis/region/?regionGroup=${this.props.selectedSubTrend}&candidateName=${this.props.selectedSubSubTrend}`
      };
  
      if (urlMap[this.props.selectedSubTrend]) {
        const { data } = await axios.get(urlMap[this.props.selectedSubTrend]);
        this.setState({ chartData: data, dataAvailable: true }); 
      }
    } catch (error) {
      console.error("Error fetching EI analysis:", error);
      this.setState({ dataAvailable: true }); 
    }

  };

  renderChart = () => {   
    if (!this.state.dataAvailable) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div
            style={{
              border: '4px solid #f3f3f3', /* Light gray background */
              borderTop: '4px solid #3498db', /* Blue color for the spinner */
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite', /* Spinner animation */
            }}
          ></div>
        </div>
      );
    }
  
    if (this.props.selectedTrend === "Gingles") {
      if (!this.state.chartData || !this.state.chartData.dataPoints) {
        return <div>No data available</div>; 
      }
      return <ChartContainer type="scatter" data={this.state.chartData} height={500} width={800} label="" />;
    }
  
    // Handle other cases (MCMC, EI) here...
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
        {this.renderChart()        }
      </div>

          {this.renderSideTable() !== null && <div className="chart-container">{this.renderSideTable()}</div>}
        </div>
      </>
    );
  }
}

export default StateAnalysis;