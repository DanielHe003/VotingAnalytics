import React, { Component } from "react";
import SideBar from "./sideBar";
import axios from "axios";
import "../stateInfo/stateInfo.css";

class StateAnalysis extends Component {
  state = {
    baseUrl: "http://localhost:8080",
    showPopup: false,
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

  fetchGingles = async() => {};
  fetchSeawulf = async () => {};
  fetchEIData = async () => {};

  render() {
    const {
      selectedState,
      selectedDistrict,
      selectedTrend,
      selectedSubTrend,
      setSelectedState,
      setSelectedDistrict,
      setSelectedTrend,
      setSelectedSubTrend,
    } = this.props;

    return (
      <>
        <SideBar
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedTrend={selectedTrend}
          selectedSubTrend={selectedSubTrend}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedTrend={setSelectedTrend}
          setSelectedSubTrend={setSelectedSubTrend}
        />
        <div className="content-container">
          <div className="map-container"></div>
        </div>
      </>
    );
  }
}

export default StateAnalysis;
