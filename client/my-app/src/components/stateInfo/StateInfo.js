import React, { Component } from "react";
import Sidebar from './Sidebar'; 
import MapComponent from '../common/MapComponent'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Chart from "../common/Chart";
import axios from 'axios';
import Popup from '../common/Popup';

class StateInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: '',
      selectedDistrict: '',
      selectedTrend: '',
      mapData: '',
      showPopup: false,
      isMapVisible: true,
      isDistrictDrawingVisible: false,
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

  updateMapData = async (state) => {
    const baseUrl = 'http://localhost:8080';
  
    const urlMap = {
      Alabama: `${baseUrl}/map/alabama`,
      California: `${baseUrl}/map/california`,
      // Alabama: `${baseUrl}/alabama/map/congressional-district`,
      // California: `${baseUrl}/california/map/congressional-district`,
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

    const buttonStyle = {
      backgroundColor: "#005BA6", 
      borderRadius: '5px', 
      color: '#fff', 
      border: 'none', 
      padding: '8px 15px',
      cursor: 'pointer', 
      transition: 'background-color 0.3s ease',
      width: '150px',
      fontSize: '14px',
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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 15px', flexWrap: 'wrap', gap: '10px' }}>
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
                style={buttonStyle} 
              >
                {this.state.isMapVisible ? "Hide Map" : "Show Map"}
              </button>
            </div>

            <Popup
              isVisible={this.state.showPopup}
              title={`${this.state.selectedState} Redistricting Process`}
              description={this.renderStateDescription(this.state.selectedState)}
              onClose={this.togglePopup}
            />
          </div>
        </div>
      </>
    );
  }
}

export default StateInfo;
