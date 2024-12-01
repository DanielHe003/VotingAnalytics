import React, { Component } from "react";
import TopBar from "./topBar";
import MapComponent from "../common/MapComponent";
import axios from "axios";
import Popup from "../common/Popup";
import "./stateInfo.css";
import SummaryComponent from "./SummaryComponent";

class StateInfo extends Component {
  state = {
    baseUrl: "http://localhost:8080",
    mapData: null,
    showPopup: false,
    summaryData: {},
    cdSummaryData: null,
    precinctView: null, 
  };

  componentDidMount() {
    const { selectedState } = this.props;
    this.fetchMapData(selectedState);
    this.fetchSummaryData(selectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }
  }

  togglePopup = () => this.setState(prevState => ({ showPopup: !prevState.showPopup }));

  fetchData = async (endpoint) => {
    try {
      const { data } = await axios.get(`${this.state.baseUrl}/${endpoint}`);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  fetchMapData = async (state) => {
    try {
      if (state) {
        const stateId = state === "Alabama" ? 1 : 6;
        const data = await this.fetchData(`states/${stateId}/districtmaps`);
        const mapData = {
          type: "FeatureCollection",
          features: data.map(item => ({
            type: "Feature",
            properties: { stateId: item.stateId, districtId: item.districtId },
            geometry: item.geometry,
          })),
        };
        this.setState({ mapData });
      } else {
        const [californiaData, alabamaData] = await Promise.all([
          this.fetchData("states/california/map"),
          this.fetchData("states/alabama/map"),
        ]);
        const mergedGeoJSON = {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "Alabama" }, geometry: alabamaData },
            { type: "Feature", properties: { name: "California" }, geometry: californiaData },
          ],
        };
        this.setState({ mapData: mergedGeoJSON });
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  fetchSummaryData = async (state) => {
    if (state && !this.state.summaryData[state]) {
      try {
        const data = await this.fetchData(`states/${state}`);
        this.setState(prevState => ({
          summaryData: { ...prevState.summaryData, [state]: data },
        }));
      } catch (error) {
        window.alert("Error fetching summary data");
      }
    }
  };

  fetchCDSummaryData = async (state) => {
    if (this.state.cdSummaryData) return;
    try {
      const data = await this.fetchData(`states/${state}`);
      this.setState({ cdSummaryData: data });
    } catch (error) {
      window.alert("Error fetching CD summary data");
    }
  };
  
  fetchPrecinctData = async (state) => {
    // if (this.state.cdSummaryData) return;
    // try {
    //   const data = await this.fetchData(`states/${state}`);
    //   this.setState({ cdSummaryData: data });
    // } catch (error) {
    //   window.alert("Error fetching CD summary data");
    // }
  };

  render() {
    const { selectedState, selectedDistrict, selectedTrend, selectedSubTrend, setSelectedState, setSelectedDistrict, setSelectedTrend, setSelectedSubTrend } = this.props;
    const { mapData, summaryData, showPopup, cdSummaryData } = this.state;

    return (
      <>
        <TopBar
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
          <div className="map-container">
            <MapComponent geoJsonData={mapData} onFeatureClick={setSelectedState} />
          </div>
          {selectedState && (
            <div className="chart-container">
              <div className="chart-inner-container">
                {selectedTrend && (
                  <div className="no-trend-selected">
                    {summaryData[selectedState] && (
                      <SummaryComponent
                        data={selectedDistrict !== "All Districts" ? cdSummaryData : summaryData[selectedState]}
                        selectedTrend={selectedTrend}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="button-container">
                {selectedState && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
              </div>
              <Popup isVisible={showPopup} state={selectedState} onClose={this.togglePopup} />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default StateInfo;