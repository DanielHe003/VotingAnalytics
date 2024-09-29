import React, { Component } from "react";
import Sidebar from './Sidebar'; 
import MapComponent from '../common/MapComponent'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import twoStates from '../data/start.json';
import CaliforniaJson from '../data/CaliforniaJson.json';
import AlabamaJson from '../data/AlabamaJson.json';
import Chart from "./Chart";

class StateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: '',
      selectedDistrict: '',
      selectedTrend: '',
      mapData: twoStates,
    };
  }

  setSelectedState = (state) => {
    this.setState({ selectedState: state });
  };

  setSelectedDistrict = (district) => {
    this.setState({ selectedDistrict: district });
  };

  setSelectedTrend = (trend) => {
    this.setState({ selectedTrend: trend });
  };

  // Moved update logic to a separate method
  updateMapData = (state) => {
    let newMapData;

    switch (state) {
      case 'Alabama':
        newMapData = AlabamaJson;
        break;
      case 'California':
        newMapData = CaliforniaJson;
        break;
      default:
        newMapData = twoStates;
    }

    this.setState({ mapData: newMapData });
  };

  // Use componentDidUpdate to check for changes in selectedState
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedState !== this.state.selectedState) {
      this.updateMapData(this.state.selectedState);
    }
  }

  render() {
    const spacing = 5;

    const sidebarStyle = {
      flex: '0 0 100%', // Sidebar takes full width
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const containerStyle = {
      display: "flex",
      alignItems: 'flex-start',
      flexWrap: 'nowrap', // Prevent wrapping to ensure side-by-side
      width: '100%', // Ensure it takes the full width
    };

    const mapContainerStyle = {
      flex: '1 1 50%', // Flexible width that starts at 50%
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box', 
      height: '70vh',
      marginRight: `${spacing}px`, 
    };

    const otherComponentStyle = {
      flex: '1 1 50%', // Flexible width that starts at 50%
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box',
      maxHeight: "638px",
      display: this.state.selectedTrend ? 'block' : 'none', 
    };

    return (
      <>
        <div style={sidebarStyle}>
          <Sidebar 
            setSelectedState={this.setSelectedState} 
            setSelectedDistrict={this.setSelectedDistrict} 
            setSelectedTrend={this.setSelectedTrend} 
          /> 
        </div>

        <div style={containerStyle}> 

          <div style={mapContainerStyle}>
            <MapComponent geoJsonData={this.state.mapData} />
          </div>

          <div style={otherComponentStyle}>
            <div>
              {this.state.selectedTrend ? ( 
                <div>
                  <Chart 
                    selectedState={this.state.selectedState} 
                    selectedDistrict={this.state.selectedDistrict} 
                    selectedTrend={this.state.selectedTrend} 
                  />
                </div>
              ) : (
                <div style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', fontSize: '48px' }} />
                  <h1 style={{ marginTop: '10px' }}>Select Filters</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default StateAnalysis;
