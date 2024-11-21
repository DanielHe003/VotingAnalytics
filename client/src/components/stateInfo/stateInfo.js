import React, { Component } from "react";
import TopBar from './topBar'; 
import MapComponent from '../common/MapComponent'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Chart from "./ChartSwitch";
import axios from 'axios';
import Popup from '../common/Popup';
import './stateInfo.css';

class StateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: '',
      showPopup: false,
      isMapVisible: true,
    };
  }

  // ----------------------------------------------------API Calls---------------------------------------------------------------------
  updateMapData = async (state) => {
    const baseUrl = 'http://localhost:8080';
    const urlMap = {
      Alabama: `${baseUrl}/map/alabama`,
      California: `${baseUrl}/map/california`,
    };

    this.setState({ mapData: null });

    const fetchMapData = async (url) => {
      try {
        const response = await axios.get(url);
        this.setState({ mapData: response.data });
      } catch (error) {
        console.error("Error fetching map data:", error);
        this.setState({ mapData: null });
      }
    };

    if (!state) {
      await fetchMapData('http://localhost:8080/map');
    } else if (urlMap[state]) {
      await fetchMapData(urlMap[state]);
    }
  };

  updateNumericalData = async (state) => {
    // const baseUrl = 'http://localhost:8080';
    // const urlMap = {
    //   Alabama: `${baseUrl}/map/alabama`,
    //   California: `${baseUrl}/map/california`,
    // };
  };

  // -------------------------------------------------------------------------------------------------------------------------

  componentDidMount() {
    this.updateMapData(this.props.selectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.updateMapData(this.props.selectedState);
    }
  }

  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  toggleVisibility = () => {
    this.setState((prevState) => ({ isMapVisible: !prevState.isMapVisible }));
  };

  render() {

    return (
      <>
        <div className="sidebar-container">

          {/* TopBar for Selection */}
          <TopBar 
            selectedState={this.props.selectedState}
            selectedDistrict={this.props.selectedDistrict}
            selectedTrend={this.props.selectedTrend}
            setSelectedState={this.props.setSelectedState}
            setSelectedDistrict={this.props.setSelectedDistrict}
            setSelectedTrend={this.props.setSelectedTrend}
          />
        </div>

        <div className="content-container"> 
          
          {/* Toggle the Map */}
          {this.state.isMapVisible && (
            <div className="map-container">
              <MapComponent 
                geoJsonData={this.state.mapData} 
                onFeatureClick={this.props.setSelectedState} 
              />
            </div>
          )}

          <div className="chart-container">

            {/* Chart Container */}
            <div className="chart-inner-container">
              <div>
                {this.props.selectedTrend ? ( 
                  <Chart 
                    selectedState={this.props.selectedState} 
                    selectedDistrict={this.props.selectedDistrict} 
                    selectedTrend={this.props.selectedTrend} 
                  />
                ) : (
                  <div className="no-trend-selected">
                    <FontAwesomeIcon icon={faCircleExclamation} className="exclamation-icon" />
                    <h1 className="no-trend-text">Select Trend Above</h1>
                  </div>
                )}
              </div>
            </div>
            
            {/* Buttons at the Bottom */}
            <div className="button-container">
              {this.props.selectedState && (
                <button onClick={this.togglePopup} className="action-button">
                  Drawing Process
                </button>
              )}
              <button onClick={this.toggleVisibility} className="action-button">
                {this.state.isMapVisible ? "Hide Map" : "Show Map"}
              </button>
            </div>
            
            {/* Popup Component */}
            <Popup  isVisible={this.state.showPopup} state={this.props.selectedState} onClose={this.togglePopup} />

          </div>
        </div>
      </>
    );
  }
}

export default StateInfo;
