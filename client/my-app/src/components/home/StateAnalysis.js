import React, { Component } from "react";
// import MapComponent from '../common/MapComponent'; 
import TopBar from './topBar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import twoStates from '../data/start.json';
import CaliforniaJson from '../data/map_income_cali.json';
import AlabamaJson from '../data/AlabamaJson.json';
import ScatterChart from "../common/ScatterChart"; // Ensure you have this component
import SupportDensityChart from "../common/SupportDensityChart"; // Ensure you have this component
import ecologicalInferenceData from '../data/precinct_analysis.json'; // Ensure you have the data

class StateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: 'California',
      selectedDistrict: '',
      selectedTrend: '',
      selectedPrecinct: '',
      selectedDemographic: '',
      mapData: twoStates,
      showPopup: false,
      isMapVisible: true,
      isDistrictDrawingVisible: false,
      demographicOptions: [
        { label: 'White', value: 'POP_WHT' },
        { label: 'Asian', value: 'POP_ASN' },
        { label: 'Hispanic/Latino', value: 'POP_HISLAT' },
        { label: 'Black', value: 'POP_BLK' },
        // Add any additional demographics here if needed
      ],
    };
  }

  setSelectedState = (state) => {
    this.setState({ selectedState: state, selectedPrecinct: '', selectedDistrict: '' });
  };

  setSelectedDistrict = (district) => {
    this.setState({ selectedDistrict: district });
  };

  setSelectedTrend = (trend) => {
    this.setState({ selectedTrend: trend, selectedDemographic: '' });
  };

  setSelectedPrecinct = (precinct) => {
    this.setState({ selectedPrecinct: precinct });
  };

  setSelectedDemographic = (demographic) => {
    this.setState({ selectedDemographic: demographic }); 
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
      isDistrictDrawingVisible: !prevState.isDistrictDrawingVisible,
    }));
  };

  // Function to filter data for the ScatterChart based on selected demographic
  getScatterChartData = () => {
    const { selectedDemographic } = this.state;

    if (selectedDemographic && ecologicalInferenceData) {
      // Access the demographic data from the JSON object
      const demographicData = ecologicalInferenceData[selectedDemographic];

      // Check if demographicData exists and is an array
      if (demographicData && Array.isArray(demographicData.democrats)) {
        return demographicData; // Return the array of democrat data
      } else {
        console.warn(`No data found for demographic: ${selectedDemographic}`);
      }
    }

    return []; // Return empty array if no demographic is selected or data is not valid
  };

  render() {
    const containerStyle = {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      width: "100%",
      gap: "20px", // Add gap between the two boxes
    };
    
  
    const topBarStyle = {
      flex: "0 0 20%", // Take up 20% of the width
      backgroundColor: "white", // Optional styling
      padding: "20px", // Add padding if needed
      boxSizing: "border-box", // Ensure padding is within the box size
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      maxHeight: "70vh",
      minHeight: "70vh",
        };
  
    const otherComponentStyle = {
      flex: "0 0 80%", // Take up the remaining 80% of the width
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      boxSizing: "border-box",
      maxHeight: "70vh",
      minHeight: "70vh",
      display: this.state.selectedState ? "block" : "none",
      position: "relative",
    };
  
    const { selectedTrend, selectedDemographic, demographicOptions } = this.state;
  
    return (
      <>
        <div style={containerStyle}>
          {/* TopBar on the left, taking up 20% */}
          <div style={topBarStyle}>
            <TopBar
              selectedState={this.state.selectedState}
              selectedDistrict={this.state.selectedDistrict}
              selectedTrend={this.state.selectedTrend}
              selectedPrecinct={this.state.selectedPrecinct}
              setSelectedState={this.setSelectedState}
              setSelectedDistrict={this.setSelectedDistrict}
              setSelectedTrend={this.setSelectedTrend}
              setSelectedPrecinct={this.setSelectedPrecinct}
              setSelectedDemographic={this.setSelectedDemographic} // Add demographic setter
              disablePrecincts={this.state.selectedDistrict === "All Districts"}
            />
          </div>
  
          {/* Other content on the right, taking up 80% */}
          <div style={otherComponentStyle}>
            <div>
              {selectedTrend === "Precinct Analysis" ? (
                <>
                  {/* Demographic Select Dropdown */}
                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Number circle */}
                      <div
                        style={{
                          width: "25px",
                          height: "25px",
                          borderRadius: "50%",
                          backgroundColor: "#005BA6",
                          color: "#fff",
                          textAlign: "center",
                          lineHeight: "25px",
                          marginRight: "15px",
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        {4}
                      </div>
  
                      {/* Demographic Select Dropdown */}
                      <select
                        id="demographic-select"
                        value={selectedDemographic}
                        onChange={(e) => this.setSelectedDemographic(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          width: "auto",
                          textAlign: "center", // Center the text inside the dropdown
                          textAlignLast: "center", // Ensures the selected text is also centered
                        }}
                      >
                        <option value="">Choose Demographic</option>
                        {demographicOptions.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
  
                  {selectedDemographic ? (
                    <ScatterChart data={this.getScatterChartData()} size={10} />
                  ) : (
                    <div></div>
                  )}
                </>
              ) : selectedTrend === "Ecological Inference" ? (
                <>
                  {/* Ecological Inference Analysis */}
                  <SupportDensityChart data={ecologicalInferenceData} />
                </>
              ) : selectedTrend ? (
                // Placeholder for other trends
                <div>
                  <h2>Other Chart Component Placeholder</h2>
                </div>
              ) : (
                <div
                  style={{
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  {/* Placeholder for default message */}
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
