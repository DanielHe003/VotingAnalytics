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
  };

  componentDidMount() {
    this.fetchMapData(this.props.selectedState);
    this.fetchSummaryData("Alabama");
    this.fetchSummaryData("California");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }
  }

  togglePopup = () =>
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));

  fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${this.state.baseUrl}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  fetchMapData = async () => {
    try {
      if (this.props.selectedState) {
        const stateId = this.props.selectedState === "Alabama" ? 1 : 6;
        const data = await this.fetchData(`states/${stateId}/districtmaps`);
        const mapData = {
          type: "FeatureCollection",
          features: data.map((item) => ({
            type: "Feature",
            properties: {
              stateId: item.stateId,
              districtId: item.districtId,
            },
            geometry: item.geometry,
          })),
        };
        this.setState({ mapData });
      } else {
        const californiaData = await this.fetchData("states/california/map");
        const alabamaData = await this.fetchData("states/alabama/map");
        const mergedGeoJSON = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "Alabama" },
              geometry: alabamaData,
            },
            {
              type: "Feature",
              properties: { name: "California" },
              geometry: californiaData,
            },
          ],
        };
        this.setState({ mapData: mergedGeoJSON });
      }
    } catch (error) {}
  };

  fetchSummaryData = async (state) => {
    if (this.state.summaryData[state]) return;
    try {
      const data = await this.fetchData(`states/${state}`);
      this.setState((prevState) => ({
        summaryData: { ...prevState.summaryData, [state]: data },
      }));
    } catch (error) {
      window.alert("Error fetching summary data");
    }
  };

  // GUI Use Case 8
  fetchCDSummaryData = async (state) => {
    if (this.state.summaryData[state]) return;
    try {
      const data = await this.fetchData(`states/${state}`);
      this.setState({ cdSummaryData: data });
    } catch (error) {
      window.alert("Error fetching summary data");
    }
  };

  render() {
    return (
      <>
        <TopBar
          selectedState={this.props.selectedState}
          selectedDistrict={this.props.selectedDistrict}
          selectedTrend={this.props.selectedTrend}
          setSelectedState={this.props.setSelectedState}
          setSelectedDistrict={this.props.setSelectedDistrict}
          setSelectedTrend={this.props.setSelectedTrend}
        />
        <div className="content-container">
          <div className="map-container">
            <MapComponent
              geoJsonData={this.state.mapData}
              onFeatureClick={this.props.setSelectedState}
            />
          </div>
          {this.props.selectedState && (
            <div className="chart-container">
              <div className="chart-inner-container">
                {!this.props.selectedTrend ? (
                  <></>
                ) : (
                  <div className="no-trend-selected">
                    {this.state.summaryData[this.props.selectedState] && (
                      <SummaryComponent
                        data={
                          this.props.selectedDistrict !== "All Districts"
                            ? this.state.cdSummaryData 
                            : this.state.summaryData[this.props.selectedState]
                        }
                        selectedTrend={this.props.selectedTrend}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="button-container">
                {this.props.selectedState && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
              </div>
              <Popup
                isVisible={this.state.showPopup}
                state={this.props.selectedState}
                onClose={this.togglePopup}
              />
              <div></div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default StateInfo;
