import React, { Component } from "react";
import TopBar from "./topBar";
import MapComponent from "../common/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Chart from "./ChartSwitch";
import axios from "axios";
import Popup from "../common/Popup";
import "./stateInfo.css";

class StateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numericData: null,
      mapData: null,
      showPopup: false,
      isMapVisible: true,
    };
  }

  //Component Mount + Update
  componentDidMount() {
    this.updateMapData(this.props.selectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.updateMapData(this.props.selectedState);
    }
  }

  //Toggle Drawing Process
  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  // Toggle Map On/Off
  toggleVisibility = () => {
    this.setState((prevState) => ({ isMapVisible: !prevState.isMapVisible }));
  };

  //Update Map Data
  updateMapData = async () => {
    const baseUrl = "http://localhost:8080";
    const urlMap = {
      Alabama: `${baseUrl}/map/alabama`,
      California: `${baseUrl}/map/california`,
    };

    const fetchMapData = async (url) => {
      try {
        const response = await axios.get(url);
        this.setState({ mapData: response.data });
      } catch (error) {
        console.error("Error fetching map data:", error);
        this.setState({ mapData: null });
      }
    };

    if (!this.props.selectedState && !this.props.selectedTrend) {
      await fetchMapData("http://localhost:8080/map");
    } else if (urlMap[this.props.selectedState]) {
      await fetchMapData(urlMap[this.props.selectedState]);
    }
  };

  //
  updateNumericalData = async () => {};

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
          {/* Map Render */}
          {this.state.isMapVisible && (
            <div className="map-container">
              <MapComponent
                geoJsonData={this.state.mapData}
                onFeatureClick={this.props.setSelectedState}
              />
            </div>
          )}

          {this.props.selectedState ? (
            <div className="chart-container">
              {/* Show Charts -- Dependent on Selected Trend */}
              <div className="chart-inner-container">
                <div>
                  {this.props.selectedTrend ? (
                    <Chart
                      data={this.state.numericData}
                      selectedState={this.props.selectedState}
                      selectedDistrict={this.props.selectedDistrict}
                      selectedTrend={this.props.selectedTrend}
                    />
                  ) : (
                    <div className="no-trend-selected">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="exclamation-icon"
                      />
                      <h1 className="no-trend-text">Select Trend Above</h1>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Layer -- Drawing Process and Hide Map */}
              <div className="button-container">
                {this.props.selectedState && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
                <button
                  onClick={this.toggleVisibility}
                  className="action-button"
                >
                  {this.state.isMapVisible ? "Hide Map" : "Show Map"}
                </button>
              </div>

              {/* Popup Component */}
              <Popup
                isVisible={this.state.showPopup}
                state={this.props.selectedState}
                onClose={this.togglePopup}
              />
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default StateInfo;
