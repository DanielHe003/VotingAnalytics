import React, { Component } from "react";
import Sidebar from './sidebar'; 
import geoJsonData from '../data/start.json';  
import MapComponent from '../common/MapComponent'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

class StateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: '',
      selectedDistrict: '',
      selectedTrend: '',
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

  render() {
    const spacing = 20;

    const sidebarStyle = {
      width: '20%',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box',
      marginRight: `${spacing}px`, 
      height: 'auto', 
    };

    const mapContainerStyle = {
      width: this.state.selectedTrend ? '55%' : '75%',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box', 
      height: '70vh',
      marginRight: `${spacing}px`, 
    };

    const otherComponentStyle = {
      width: this.state.selectedTrend ? '25%' : '0', 
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box',
      marginRight: `${spacing}px`, 
      height: '100%',
      display: this.state.selectedTrend ? 'block' : 'none', 
    };

    return (
      <div style={{ display: "flex", alignItems: 'flex-start' }}> 
        <div style={sidebarStyle}>
          <Sidebar 
            setSelectedState={this.setSelectedState} 
            setSelectedDistrict={this.setSelectedDistrict} 
            setSelectedTrend={this.setSelectedTrend} 
          /> 
        </div>

        <div style={mapContainerStyle}>
          <MapComponent geoJsonData={geoJsonData} />
        </div>

        <div style={otherComponentStyle}>
          <div>
            {this.state.selectedTrend ? ( 
              <div>
                <h2>Selected Filters:</h2>
                <p><strong>State:</strong> {this.state.selectedState}</p>
                <p><strong>District:</strong> {this.state.selectedDistrict}</p>
                <p><strong>Trend:</strong> {this.state.selectedTrend}</p>
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
    );
  }
}

export default StateAnalysis;
