import React from "react";
import TopBar from "./TopBar";
import MapComponent from "../common/MapComponent";
import Popup from "../common/Popup";
import "./StateInfo.css";
import SummaryComponent from "./SummaryComponent";
import CDSummary from "./CDSummary";
import ApiService from "../common/ApiService";
import axios from "axios";

class StateInfo extends React.Component {
  state = {
    mapData: null,
    showPopup: false,
    summaryData: {},
    cdSummaryData: null,
    precinctView: null,
  };

  componentDidMount() {
    this.fetchMapData();
    this.fetchSummaryData(this.props.selectedState);
    this.fetchCDSummaryData();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.selectedTrend === "precinct" && this.props.selectedTrend !== "precinct") this.fetchMapData(this.props.selectedState);

    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }

    if (
      prevProps.selectedDistrict !== this.props.selectedDistrict &&
      this.props.selectedDistrict !== "0"
    ) {
      this.fetchCDSummaryData();
    }

    if (
      prevProps.selectedDistrict !== this.props.selectedDistrict &&
      this.props.selectedDistrict === "0"
    ) {
      this.fetchSummaryData(this.props.selectedState);
      // this.fetchCDSummaryData();
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      if (this.props.selectedTrend === "precinct") {
        this.fetchPrecinctBoundaries();
      }
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend && this.props.selectedTrend !== "precinct") {
        this.setState({heatmapLegend: null});
    }

    if (
      prevProps.selectedSubTrend !== this.props.selectedSubTrend ||
      prevProps.selectedSubSubTrend !== this.props.selectedSubSubTrend
    ) {
      if (this.props.selectedTrend === "precinct") {
        this.fetchPrecinctHeatMap();
      }
    }
  }

  togglePopup = () =>
    this.setState((prevState) => ({ showPopup: !prevState.showPopup }));

  // fetchPrecinctBoundaries = async () => {
  //   try {
  //     if (!this.props.selectedState) return;
  //     const stateId =
  //       this.props.selectedState === "Alabama"
  //         ? 1
  //         : this.props.selectedState === "California"
  //         ? 6
  //         : null;
  //     const fetchDataForState = async (stateId, page) =>
  //       ApiService.fetchData(
  //         `states/${stateId}/precincts/geometries?page=${page}&size=${6700}`
  //       );
     
  //       if (stateId === 6) {
  //         const mergedData = await ApiService.fetchData(
  //           `states/${stateId}/precincts/geometries?page=0&size=20100`
  //         );
  //         console.log(mergedData);
  //         const mergedGeoJSON = {
  //           type: "FeatureCollection",
  //           features: [mergedData["featureCollection"]],
  //         };
  //         this.setState({
  //           mapData: mergedGeoJSON,
  //           originalPrecinctData: mergedGeoJSON, 
  //         });

  //       } else {
  //         const data = await fetchDataForState(stateId, 0);
  //         const mergedGeoJSON = {
  //           type: "FeatureCollection",
  //           features: [data["featureCollection"]],
  //         };
  //         this.setState({
  //           mapData: mergedGeoJSON,
  //           originalPrecinctData: mergedGeoJSON, 
  //         });
  //       }
  //   } catch (error) {
  //     console.error("Error fetching precinct boundaries:", error);
  //   }
  // };

  fetchPrecinctBoundaries = async () => {
    try {
      if (!this.props.selectedState) return;
  
      const stateName = this.props.selectedState;
  
      let geoJSONData;
  
      switch (stateName) {
        case 'Alabama':
          const alabamaResponse = await fetch('/Alabama_precinct_merged.geojson');
          geoJSONData = await alabamaResponse.json();
          break;
        case 'California':
          const californiaResponse = await fetch('/California_precinct_merged.geojson');
          geoJSONData = await californiaResponse.json();
          break;
        default:
          console.error(`No GeoJSON available for state: ${stateName}`);
          return;
      }
  
      this.setState({
        mapData: geoJSONData,
      });
    console.log('GeoJSON data loaded successfully.');
      
  } catch (error) {
      console.error("Error loading precinct boundaries:", error);
    }
  };
  
  
  
  fetchPrecinctHeatMap = async () => {
    try {
      if (!this.props.selectedState || !this.props.selectedSubTrend) return;
      const stateId = this.props.selectedState === "Alabama" ? 1 : 6;

      const urlMap = {
        demographic: `states/${stateId}/heatmap/demographic/${this.props.selectedSubSubTrend}`,
        economic: `states/${stateId}/heatmap/economic`,
        region: `states/${stateId}/heatmap/region-type`,
        poverty: `states/${stateId}/heatmap/poverty`,
        pil: `states/${stateId}/heatmap/political-income`,
      };

      if (urlMap[this.props.selectedSubTrend]) {
        if(this.props.selectedSubSubTrend === " "){
          return;
        }

        const url = `${urlMap[this.props.selectedSubTrend]}`;
        const { data } = await axios.get(url);
        this.setState({
          mapData: {
            type: "FeatureCollection",
            features: this.state.mapData.features.map(
              (feature) => {
                const matchingData = data.data.find(
                  (entry) =>
                    entry.precinctKey === feature.properties.precinctKey
                );
                return {
                  ...feature,
                  properties: {
                    ...feature.properties,
                    ...matchingData,
                  },
                };
              }
            ),
          },
          heatmapLegend: data.legend,
        });
        console.log(this.state.mapData);
        //window.alert("payload recieved");
      }
    } catch (error) {
      console.error("Error fetching precinct heatmap:", error);
    }
  };

  fetchMapData = async () => {
    try {
      const state = this.props.selectedState;
      if (state) {
        const stateId = this.props.selectedState === "Alabama" ? 1 : 6;
        const data = await ApiService.fetchMapData(stateId);

        const mapData = {
          type: "FeatureCollection",
          features: [data],
        };

        this.setState({ mapData });
      } else {

        const californiaData = await ApiService.fetchData("states/California/map");
        const alabamaData = await ApiService.fetchData("states/Alabama/map");
        this.setState({
          mapData: {
            type: "FeatureCollection",
            features: [alabamaData, californiaData],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  fetchSummaryData = async () => {
    const state = this.props.selectedState;
    if(!state){
      return;
    }
    
    if (state && this.state.summaryData[state]) {
        return;
    }

    try {

      let summaryData = await ApiService.fetchStateSummary(state);
        this.setState((prevState) => ({
            summaryData: { ...prevState.summaryData, [state]: summaryData },
        }));

        const stateId = this.props.selectedState === "Alabama" ? 1 : 6;
        const {data} = await axios.get(`/states/${stateId}/districtRepresentation`);

        const graphData = data.map((district) => ({
            "District #": district.districtId,
            "Representative Name": district.representative,
            "Representative Party": district.party,
            "Racial/Ethnic Group": district.racialEthnicGroup,
        })).sort((a, b) => a["District #"] - b["District #"]);
        this.setState({ cdSummaryData: graphData });
    } catch (error) {
        console.error("Error fetching summary data:", error);
    }
};


  getDistrictNumber(value) {
    const match = value.match(/^\D+\s*(\d+)$/);
    if (!match) {
      return null;
    }
    return parseInt(match[1], 10);
  }

  fetchCDSummaryData = async () => {
    try {
      const selectedDistrictNumber = this.props.selectedDistrict
        ? this.getDistrictNumber(this.props.selectedDistrict)
        : null;

      if (!selectedDistrictNumber) {
        console.warn("Selected district number is null or invalid.");
        return;
      }

      if (!this.props.selectedState) {
        console.warn("Selected state is missing.");
        return;
      }

      const stateId = this.props.selectedState === "Alabama" ? 1 : 6;

      console.log(
        "Fetching data for stateId:",
        stateId,
        "and district:",
        selectedDistrictNumber
      );

      const { data } = await axios.get(
        `/states/${stateId}/districtRepresentation`
      );

      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        return;
      }

      const sortedData = data.sort((a, b) => a.districtId - b.districtId);

      console.log("Sorted data:", sortedData);

      const districtData = sortedData[selectedDistrictNumber - 1];

      if (!districtData) {
        console.warn(
          `No data found for district number: ${selectedDistrictNumber}`
        );
        return;
      }

      this.setState({ specificDistrict: districtData }, () => {
        console.log("cdSummaryData updated:", this.state.specificDistrict);
      });
    } catch (error) {
      console.error("Error fetching CD summary data:", error);
      //window.alert("Error fetching CD summary data");
    }
  };

  
  render() {

    // //window.alert(this.props.selectedDistrict);
    // //window.alert(this.props.selectedTrend);

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
              heatMapLegend={this.state.heatmapLegend}
              selectedState={this.props.selectedState}
              title={this.props.selectedTrend === "ComparePlans" ?  this.props.selectedSubTrend : null}
            />
          </div>

          {/* Right Side */}

          {this.props.selectedState &&
                    this.props.selectedDistrict === "All Districts" &&
                    this.props.selectedTrend === "ComparePlans" && (
                      <>
          <div className="map-container">
            <MapComponent
              geoJsonData={this.state.compare}
              onFeatureClick={this.props.setSelectedState}
              selectedTrend={this.props.selectedTrend}
              heatMapLegend={this.state.heatmapLegend}
              selectedState={this.props.selectedState}
              title={this.props.selectedTrend === "ComparePlans" ?  this.props.selectedSubSubTrend : null}

            />
          </div>
                      </>
            )}


          {this.props.selectedState &&
            (this.props.selectedDistrict === "All Districts" || this.props.selectedDistrict === "0") && this.props.selectedTrend !== "ComparePlans" && (
              <div className="chart-container">
                <div className="chart-inner-container">

                  {this.props.selectedTrend !== "precinct" &&
                    this.props.selectedTrend !== "ComparePlans" && (
                      <div className="no-trend-selected">
                        {this.state.summaryData[this.props.selectedState] && (
                          <SummaryComponent
                            data={
                              this.state.summaryData[this.props.selectedState]
                            }
                            selectedTrend={this.props.selectedTrend}
                            setSelectedTrend={this.props.setSelectedTrend}
                            cdSummaryData={this.state.cdSummaryData}
                          />
                        )}
                      </div>
                    )}
                </div>
                <div className="button-container">
                  {this.props.selectedState && (
                    <button
                      onClick={this.togglePopup}
                      className="action-button"
                    >
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

{this.props.selectedState &&
  (this.props.selectedDistrict !== "All Districts" && this.props.selectedDistrict !== "0") && (
    <>
      <div className="chart-container">
        <CDSummary data={this.state.specificDistrict} />
      </div>
    </>
)}



        </div>
      </>
    );
  }
}

export default StateInfo;
