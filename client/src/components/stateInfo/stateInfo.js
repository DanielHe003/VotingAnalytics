import React from "react";
import TopBar from "./TopBar";
import MapComponent from "../common/MapComponent";
import Popup from "../common/Popup";
import "./StateInfo.css";
import SummaryComponent from "./SummaryComponent";
import ApiService from "../common/ApiService";

class StateInfo extends React.Component {
  state = {
    mapData: null,
    showPopup: false,
    summaryData: {},
    cdSummaryData: null,
    precinctView: null,
  };

  componentDidMount() {
    this.fetchMapData(this.props.selectedState);
    this.fetchSummaryData(this.props.selectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }
  
    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      if (this.props.selectedTrend === "precinct") {
        this.fetchPrecinctBoundaries();
        this.fetchPrecinctHeatMap();
      }
    }
  
    if (prevProps.selectedSubTrend !== this.props.selectedSubTrend || prevProps.selectedSubSubTrend !== this.props.selectedSubSubTrend) {
      if (this.props.selectedTrend === "precinct") {
        this.fetchPrecinctHeatMap();
      }
    }
  }  

  togglePopup = () => this.setState((prevState) => ({ showPopup: !prevState.showPopup }));

  fetchPrecinctBoundaries = async () => {
  try {
    const { selectedState } = this.props;
    if (!selectedState) return;

    const stateId = selectedState === "Alabama" ? 1 : selectedState === "California" ? 6 : null;
    if (!stateId) return;

    const pageSize = 6700;
    const fetchDataForState = async (stateId, page) => ApiService.fetchData(`states/${stateId}/precincts/geometries?page=${page}&size=${pageSize}`);

    if (stateId === 6) {
      const data = await Promise.all([0, 1, 2].map(page => fetchDataForState(stateId, page)));
      const mergedData = data.flatMap(d => d?.featureCollection?.features || []);
      this.setState({ mapData: { type: "FeatureCollection", features: mergedData } });
    } else {
      const data = await fetchDataForState(stateId, 0);
      const mergedGeoJSON = { type: "FeatureCollection", features: [data["featureCollection"]] };
      this.setState({ mapData: mergedGeoJSON, orginalPrecinctData: mergedGeoJSON });
    }
  } catch (error) {
    console.error("Error fetching precinct boundaries:", error);
  }
};


  fetchPrecinctHeatMap = async () => {
    try {
      const { selectedState, selectedSubTrend, selectedSubSubTrend } = this.props;
      if (!selectedState || !selectedSubTrend) return;
      const stateId = selectedState === "Alabama" ? 1 : selectedState === "California" ? 6 : null;
  
      let data;  
      switch (selectedSubTrend) {
        case "demographic":
          data = await ApiService.fetchData(`states/${stateId}/heatmap/demographic/${selectedSubSubTrend}`);
          break;
        case "economic":
          data = await ApiService.fetchData(`states/${stateId}/heatmap/economic`);
          break;
        case "region":
          data = await ApiService.fetchData(`states/${stateId}/heatmap/region-type`);
          break;
        case "poverty":
          data = await ApiService.fetchData(`states/${stateId}/heatmap/poverty`);
          break;
        case "pil":
          data = await ApiService.fetchData(`states/${stateId}/heatmap/political-income`);
          break;
        default:
          console.error("Invalid sub-trend selected");
          return;
      }
      if (data) {
        this.setState({
          mapData: {
            type: "FeatureCollection",
            features: this.state.orginalPrecinctData.features[0].features.map((feature) => {
              const matchingData = data.data.find((entry) => entry.precinctKey === feature.properties.precinctKey);
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  ...matchingData,
                },
              };
            }),
          },
          heatmapLegend: data.legend,
        });
      }
    } catch (error) {
      console.error("Error fetching precinct heatmap:", error);
    }
  };
  
  fetchMapData = async () => {
    try {
      const state = this.props.selectedState;
      if (state) {
        const stateId = state === "Alabama" ? 1 : 6;
        const data = await ApiService.fetchMapData(stateId);
        console.log(data);
        const mapData = {
          type: "FeatureCollection",
          features: [data],
        };
        this.setState({ mapData });
      } else {
        const [californiaData, alabamaData] = await Promise.all([
          ApiService.fetchData("states/california/map"),
          ApiService.fetchData("states/alabama/map"),
        ]);
            
        this.setState({ mapData: {
          type: "FeatureCollection",
          features: [alabamaData, californiaData],
        } });

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
        this.setState((prevState) => ({
          summaryData: { ...prevState.summaryData, [state]: data },
        }));
      } catch (error) {
        window.alert("Error fetching summary data");
      }
    }
  };
  
  //ENDPOINT AVAILABLE -- PENDING TESTING 
  // fetchCDSummaryData = async () => {
  //   if (this.props.selectedDistrict === "All Districts")
  //     this.fetchSummaryData();
  //   if (this.state.cdSummaryData) return;
  //   try {
  //     const data = await ApiService.fetchStateSummary(this.props.selectedState);
  //     this.setState({ cdSummaryData: data });
  //   } catch (error) {
  //     window.alert("Error fetching CD summary data");
  //   }
  // };

  render() {
    return (
      <>
        <TopBar
          selectedState={this.props.selectedState}
          selectedDistrict={this.props.selectedDistrict}
          selectedTrend={this.props.selectedTrend}
          selectedSubTrend={this.props.selectedSubTrend}
          selectedSubSubTrend={this.props.selectedSubSubTrend}
          setSelectedState={this.props.setSelectedState}
          setSelectedDistrict={this.props.setSelectedDistrict}
          setSelectedTrend={this.props.setSelectedTrend}
          setSelectedSubTrend={this.props.setSelectedSubTrend}
          setSelectedSubSubTrend={this.props.setSelectedSubSubTrend}
        />

        <div className="content-container">
          {/* Left Side */}
          <div className="map-container">
          <MapComponent
          geoJsonData={this.state.mapData}
          onFeatureClick={this.props.setSelectedState}
          selectedTrend={this.props.selectedTrend}
          heatMapLegend={this.state.heatmapLegend} />
          </div>

          {/* Right Side */}
          {this.props.selectedState && (
            <div className="chart-container">
              <div className="chart-inner-container">
                {this.props.selectedTrend && (
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
                {this.props.State && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
              </div>
              <Popup
                isVisible={this.state.showPopup}
                state={this.props.State}
                onClose={this.togglePopup}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default StateInfo;