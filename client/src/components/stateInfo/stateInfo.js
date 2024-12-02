import React from "react";
import TopBar from "./TopBar";
import MapComponent from "../common/MapComponent";
import Popup from "../common/Popup";
import "./StateInfo.css";
import SummaryComponent from "./SummaryComponent";
import ApiService from '../common/ApiService';

class StateInfo extends React.Component {
  state = {
    mapData: null,
    showPopup: false,
    summaryData: {},
    cdSummaryData: null,
    precinctView: null,
  };

  componentDidMount() {
    this.fetchMapData(this.propsselectedState);
    this.fetchSummaryData(this.propsselectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }
  }

  togglePopup = () => this.setState(prevState => ({ showPopup: !prevState.showPopup }));

  fetchMapData = async () => {
    try {
      const state = this.props.selectedState;
      if (state) {
        const stateId = state === "Alabama" ? 1 : 6;
        const data = await ApiService.fetchMapData(stateId);  
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
          ApiService.fetchData("states/california/map"),
          ApiService.fetchData("states/alabama/map"),
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
  
  fetchSummaryData = async () => {
    const state = this.props.selectedState;
    if (state && !this.state.summaryData[state]) {
      try {
        const data = await ApiService.fetchStateSummary(state);
        this.setState(prevState => ({
          summaryData: { ...prevState.summaryData, [state]: data },
        }));
      } catch (error) {
        window.alert("Error fetching summary data");
      }
    }
  };
  
  fetchCDSummaryData = async () => {
    if (this.state.cdSummaryData) return;
    try {
      const data = await ApiService.fetchStateSummary(this.props.selectedState);
      this.setState({ cdSummaryData: data });
    } catch (error) {
      window.alert("Error fetching CD summary data");
    }
  };

  render() {
    return (
      <>
        <TopBar
          selectedState={this.props.selectedState}
          selectedDistrict={this.props.selectedDistrict}
          selectedTrend={this.props.selectedTrend}
          selectedSubTrend={this.props.selectedSubTrend}
          setSelectedState={this.props.setSelectedState}
          setSelectedDistrict={this.props.setSelectedDistrict}
          setSelectedTrend={this.props.setSelectedTrend}
          setSelectedSubTrend={this.props.setSelectedSubTrend}
        />
        <div className="content-container">
          {/* Left Side */}
          <div className="map-container">
            <MapComponent geoJsonData={this.state.mapData} onFeatureClick={this.props.setSelectedState} />
          </div>

          {/* Right Side */}
          {this.props.selectedState && (
            <div className="chart-container">
              <div className="chart-inner-container">
                {this.props.selectedTrend && (
                  <div className="no-trend-selected">
                    {this.state.summaryData[this.props.selectedState] && (
                      <SummaryComponent
                        data={this.props.selectedDistrict !== "All Districts" ? this.state.cdSummaryData : this.state.summaryData[this.props.selectedState]}
                        selectedTrend={this.props.selectedTrend}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="button-container">
                {this.props.State && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
              </div>
              <Popup isVisible={this.state.showPopup} state={this.props.State} onClose={this.togglePopup} />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default StateInfo;