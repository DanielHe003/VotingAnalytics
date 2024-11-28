import React, { Component } from "react";
import TopBar from './sideBar';
import axios from 'axios';

class StateAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: '',
      selectedDistrict: '',
      selectedTrend: '',
      selectedPrecinct: '',
      selectedDemographic: '',
      mapData: '',
      showPopup: false,
      isMapVisible: true,
      isDistrictDrawingVisible: false,
      demographicOptions: [
        { label: 'White', value: 'POP_WHT' },
        { label: 'Asian', value: 'POP_ASN' },
        { label: 'Hispanic/Latino', value: 'POP_HISLAT' },
        { label: 'Black', value: 'POP_BLK' },
      ],
      precinctData: null, 
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
    this.setState({ selectedDemographic: demographic }, this.fetchPrecinctAnalysis);
  };

  handleFeatureClick = (value) => {
    this.setState({ selectedState: value });
  };


  togglePopup = () => {
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
  };

  toggleVisibility = () => {
    this.setState((prevState) => ({
      isMapVisible: !prevState.isMapVisible,
      isDistrictDrawingVisible: !prevState.isDistrictDrawingVisible,
    }));
  };

  fetchPrecinctAnalysis = async () => {

    if(this.state.precinctData != null){
      return;
    }

    const baseUrl = 'http://localhost:8080';
    const url = `${baseUrl}/${this.state.selectedState}/analysis/precinct-analysis`;

    if (this.state.selectedDemographic) {
      try {
        console.log("Request made");
        const response = await axios.get(url);
        const demographicData = response.data;

        if (demographicData) {
          const selectedDemographicData = demographicData[this.state.selectedDemographic];

          if (selectedDemographicData) {
            this.setState({ precinctData: selectedDemographicData });
          } else {
            console.error(`No data found for demographic: ${this.state.selectedDemographic}`);
          }
        } else {
          console.error('No data returned from the server.');
        }
      } catch (error) {
        console.error('Error fetching precinct analysis:', error);
      }
    }
  };

  render() {
    const containerStyle = {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      width: "100%",
      gap: "20px",
    };

    const topBarStyle = {
      flex: "0 0 20%",
      backgroundColor: "white",
      padding: "20px",
      boxSizing: "border-box",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      maxHeight: "70vh",
      minHeight: "70vh",
    };

    const otherComponentStyle = {
      flex: "0 0 80%",
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

    const { selectedTrend, selectedDemographic, demographicOptions, precinctData } = this.state;

    return (
      <>
        <div style={containerStyle}>
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
              setSelectedDemographic={this.setSelectedDemographic}
              disablePrecincts={this.state.selectedDistrict === "All Districts"}
            />
          </div>

          <div style={otherComponentStyle}>
            <div>
              {selectedTrend === "Precinct Analysis" ? (
                <>
                  <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{
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
                        }}>
                        {4}
                      </div>
                      <select
                        id="demographic-select"
                        value={selectedDemographic}
                        onChange={(e) => this.setSelectedDemographic(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          width: "auto",
                          textAlign: "center",
                          textAlignLast: "center",
                        }}>
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
                    precinctData ? (
                    //   <ScatterChart 
                    //   populationStat={this.state.selectedDemographic}
                    //   data={precinctData} 

                    // />
                    <>
                    </>
                    ) : (
                      <div><center>Loading data...</center></div>
                    )
                  ) : (
                    <div></div>
                  )}
                </>
              ) : selectedTrend === "Ecological Inference" ? (
                <>
                  {/* <SupportDensityChart data={null} /> */}
                </>
              ) : selectedTrend ? (
                <div>
                  <h2>Other Chart Component Placeholder</h2>
                </div>
              ) : (
                <div style={{ paddingTop: "20px", paddingBottom: "20px", textAlign: "center" }}></div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default StateAnalysis;
