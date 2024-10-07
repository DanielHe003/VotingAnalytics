import React, { Component } from "react";
import Sidebar from './Sidebar'; 
import MapComponent from '../common/MapComponent'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import twoStates from '../data/start.json';
import CaliforniaJson from '../data/map_income_cali.json';
import AlabamaJson from '../data/AlabamaJson.json';
import Chart from "../common/Chart";

class StateInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: '',
      selectedDistrict: '',
      selectedTrend: '',
      mapData: twoStates,
      showPopup: false,
      isMapVisible: true,
      isDistrictDrawingVisible: false, // New state for district drawing
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

  handleFeatureClick = (value) => {
    this.setState({ selectedState: value });
  };

  updateMapData = (state) => {
    let newMapData;

    if (!state) {
      newMapData = null;
    } else {
      switch (state) {
        case 'Alabama':
          newMapData = AlabamaJson;
          break;
        case 'California':
          newMapData = CaliforniaJson;
          break;
        default:
          newMapData = null;
      }
    }

    this.setState({ mapData: newMapData });
  };

  componentDidMount() {
    this.updateMapData(null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedState !== this.state.selectedState) {
      this.updateMapData(this.state.selectedState);
    }
  }

  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  toggleVisibility = () => {
    this.setState((prevState) => ({
      isMapVisible: !prevState.isMapVisible,
      isDistrictDrawingVisible: !prevState.isDistrictDrawingVisible, // Toggle both
    }));
  };

  renderStateDescription(selectedState) {
    switch (selectedState) {
      case 'Alabama':
        return (
          <span>
            In Alabama, the redistricting process is primarily controlled by the state legislature, 
            with some opportunity for public input. The governor also plays a significant role in 
            approving the maps, and they may be subject to judicial review.
          </span>
        );
      case 'California':
        return (
          <span>
            California uses an independent commission for redistricting, emphasizing public input 
            and transparency in the process. The California Citizens Redistricting Commission 
            draws district maps, and these can be challenged in court to prevent gerrymandering.
          </span>
        );
      default:
        return <span>Please select a state to see its redistricting process.</span>;
    }
  }

  render() {
    const spacing = 5;

    const sidebarStyle = {
      flex: '0 0 100%',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const containerStyle = {
      display: "flex",
      alignItems: 'flex-start',
      flexWrap: 'nowrap',
      width: '100%',
    };

    const mapContainerStyle = {
      flex: '1 1 50%',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box', 
      height: '70vh',
      marginRight: `${spacing}px`, 
    };

    const otherComponentStyle = {
      flex: '1 1 50%',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      boxSizing: 'border-box',
      maxHeight: "70vh",
      minHeight: "70vh",
      display: this.state.selectedState ? 'block' : 'none',
      position: 'relative',
    };

    const popupStyle = {
      display: this.state.showPopup ? 'block' : 'none',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      padding: '30px',
      zIndex: 1000,
      maxWidth: '400px',
      width: '90%',
    };

    const overlayStyle = {
      display: this.state.showPopup ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 999,
    };

    const buttonStyle = {
      backgroundColor: "#005BA6", 
      borderRadius: '5px', 
      color: '#fff', 
      border: 'none', 
      padding: '8px 15px', // Reduced padding for smaller buttons
      cursor: 'pointer', 
      transition: 'background-color 0.3s ease',
      width: '150px', // Reduced width
      fontSize: '14px', // Reduced font size
    };

    const closeButtonStyle = {
      ...buttonStyle,
      marginLeft: "10px",
    };

    const buttonContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 15px',
      flexWrap: 'wrap', // Prevent overflow
      gap: '10px', // Add space between buttons
    };

    return (
      <>
        <div style={sidebarStyle}>
          <Sidebar 
            selectedState={this.state.selectedState}
            selectedDistrict={this.state.selectedDistrict}
            selectedTrend={this.state.selectedTrend}
            setSelectedState={this.setSelectedState}
            setSelectedDistrict={this.setSelectedDistrict}
            setSelectedTrend={this.setSelectedTrend}
          />
        </div>

        <div style={containerStyle}> 
          {this.state.isMapVisible && (
            <div style={mapContainerStyle}>
              <MapComponent 
                geoJsonData={this.state.mapData} 
                onFeatureClick={this.handleFeatureClick} 
              />
            </div>
          )}

          <div style={otherComponentStyle}>
            <div>
              {this.state.selectedTrend ? ( 
                <Chart 
                  selectedState={this.state.selectedState} 
                  selectedDistrict={this.state.selectedDistrict} 
                  selectedTrend={this.state.selectedTrend} 
                  style={{}} 
                />
              ) : (
                <div style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', fontSize: '48px' }} />
                  <h1 style={{ marginTop: '10px' }}>Select Trend Above</h1>
                </div>
              )}
            </div>

            {/* Popup Overlay */}
            <div style={overlayStyle} onClick={this.togglePopup} />
            <div style={popupStyle}>
              <h2>{this.state.selectedState} Redistricting Process</h2>
              <div>{this.renderStateDescription(this.state.selectedState)}</div>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button 
                  onClick={this.togglePopup} 
                  style={closeButtonStyle}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Button Container */}
            <div style={buttonContainerStyle}>
              {this.state.selectedState && (
                <button 
                  onClick={this.togglePopup} 
                  style={buttonStyle}
                >
                  Drawing Process
                </button>
              )}
              <button 
                onClick={this.toggleVisibility}
                style={buttonStyle} // Use the same style for consistency
              >
                {this.state.isMapVisible ? "Hide Map" : "Show Map"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default StateInfo;
