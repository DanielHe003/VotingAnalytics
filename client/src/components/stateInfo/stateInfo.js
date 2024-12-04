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
    if (!this.props.selectedState) return;

    const stateId = this.props.selectedState === "Alabama" ? 1 : this.props.selectedState === "California" ? 6 : null;
    
    //Working through performance issues for California as we're loading ~20k+ precincts -- trying to determine the most effective method 
    const fetchDataForState = async (stateId, page) => ApiService.fetchData(`states/${stateId}/precincts/geometries?page=${page}&size=${6700}`);
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
      if (!this.props.selectedState || !this.props.selectedSubTrend) return;
      const stateId = this.props.selectedState === "Alabama" ? 1 : this.props.selectedState === "California" ? 6 : null;

      const urlMap = {
        "demographic": `states/${stateId}/heatmap/demographic/${this.props.selectedSubSubTrend}`,
        "economic": `states/${stateId}/heatmap/economic`,
        "region": `states/${stateId}/heatmap/region-type`,
        "poverty": `states/${stateId}/heatmap/poverty`,
        "pil": `states/${stateId}/heatmap/political-income`,
      };

      if (urlMap[this.props.selectedSubTrend]) {
        const payload = await ApiService.fetchData(urlMap[this.props.selectedSubTrend])
        this.setState({
          mapData: {
            type: "FeatureCollection",
            features: this.state.orginalPrecinctData.features[0].features.map((feature) => {
              const matchingData = payload.data.find((entry) => entry.precinctKey === feature.properties.precinctKey);
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  ...matchingData,
                },
              };
            }),
          },
          heatmapLegend: payload.legend,
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
        const stateId = this.props.selectedState === "Alabama" ? 1 : this.props.selectedState === "California" ? 6 : null;
        const data = await ApiService.fetchMapData(stateId);
        console.log(data);
        const mapData = {
          type: "FeatureCollection",
          features: [data],
        };
        this.setState({ mapData });
      } else {

        const californiaData = await ApiService.fetchData("states/california/map");
        const alabamaData = await ApiService.fetchData("states/alabama/map");            
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
                {this.props.selectedState && (
                  <button onClick={this.togglePopup} className="action-button">
                    Drawing Process
                  </button>
                )}
              </div>
              <Popup
                isVisible={this.state.showPopup}
                state={this.props.selectedState}
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