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
    // this.fetchSummaryData(this.props.selectedState);
  }

  componentDidUpdate(prevProps) {
    // if(prevProps.selectedTrend === "precinct" && this.props.selectedTrend !== "precinct") this.fetchMapData(this.props.selectedState);

    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchMapData(this.props.selectedState);
      this.fetchSummaryData(this.props.selectedState);
    }

    if (
      prevProps.selectedDistrict !== this.props.selectedDistrict &&
      this.props.selectedDistrict !== "All Districts"
    ) {
      this.fetchCDSummaryData();
    }

    if (
      prevProps.selectedDistrict !== this.props.selectedDistrict &&
      this.props.selectedDistrict === "All Districts"
    ) {
      this.fetchSummaryData(this.props.selectedState);
      // this.fetchCDSummaryData();
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      if (this.props.selectedTrend === "precinct") {
        this.fetchPrecinctBoundaries();
      }
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

  fetchPrecinctBoundaries = async () => {
    try {
      if (!this.props.selectedState) return;
      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;
      const fetchDataForState = async (stateId, page) =>
        ApiService.fetchData(
          `states/${stateId}/precincts/geometries?page=${page}&size=${6700}`
        );
      if (stateId === 6) {
        const data = await Promise.all(
          [0, 1, 2].map((page) => fetchDataForState(stateId, page))
        );
        const mergedData = data.flatMap(
          (d) => d?.featureCollection?.features || []
        );
        this.setState({
          mapData: { type: "FeatureCollection", features: mergedData },
        });
      } else {
        const data = await fetchDataForState(stateId, 0);
        const mergedGeoJSON = {
          type: "FeatureCollection",
          features: [data["featureCollection"]],
        };
        this.setState({
          mapData: mergedGeoJSON,
          orginalPrecinctData: mergedGeoJSON,
        });
      }
    } catch (error) {
      console.error("Error fetching precinct boundaries:", error);
    }
  };

  fetchPrecinctHeatMap = async () => {
    try {
      if (!this.props.selectedState || !this.props.selectedSubTrend) return;
      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;

      const urlMap = {
        demographic: `states/${stateId}/heatmap/demographic/${this.props.selectedSubSubTrend}`,
        economic: `states/${stateId}/heatmap/economic`,
        region: `states/${stateId}/heatmap/region-type`,
        poverty: `states/${stateId}/heatmap/poverty`,
        pil: `states/${stateId}/heatmap/political-income`,
      };

      if (urlMap[this.props.selectedSubTrend]) {
        const payload = await ApiService.fetchData(
          urlMap[this.props.selectedSubTrend]
        );
        this.setState({
          mapData: {
            type: "FeatureCollection",
            features: this.state.orginalPrecinctData.features[0].features.map(
              (feature) => {
                const matchingData = payload.data.find(
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
        const stateId =
          this.props.selectedState === "Alabama"
            ? 1
            : this.props.selectedState === "California"
            ? 6
            : null;
        const data = await ApiService.fetchMapData(stateId);
        console.log(data);
        const mapData = {
          type: "FeatureCollection",
          features: [data],
        };
        this.setState({ mapData });
      } else {
        const californiaData = await ApiService.fetchData(
          "states/california/map"
        );
        const alabamaData = await ApiService.fetchData("states/alabama/map");
        // console.log(californiaData);
        // console.log(alabamaData);
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
    if (state && !this.state.summaryData[state]) {
      try {
        const data = await ApiService.fetchStateSummary(state);
        console.log(data);
        this.setState((prevState) => ({
          summaryData: { ...prevState.summaryData, [state]: data },
        }));
      } catch (error) {
        window.alert("Error fetching summary data");
      }
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

      this.props.setSelectedTrend("Select Trend");

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

      this.setState({ cdSummaryData: districtData }, () => {
        console.log("cdSummaryData updated:", this.state.cdSummaryData);
      });
    } catch (error) {
      console.error("Error fetching CD summary data:", error);
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
            />
          </div>

          {/* Right Side */}

          {this.props.selectedState &&
            this.props.selectedDistrict === "All Districts" && (
              <div className="chart-container">
                <div className="chart-inner-container">
                  {this.props.selectedTrend !== "precinct" && (
                    <div className="no-trend-selected">
                      {this.state.summaryData[this.props.selectedState] && (
                        <SummaryComponent
                          data={
                            this.state.summaryData[this.props.selectedState]
                          }
                          selectedTrend={this.props.selectedTrend}
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
            this.props.selectedDistrict !== "All Districts" && (
              <>
                <div className="chart-container">
                  <CDSummary data={this.state.cdSummaryData} />
                </div>
              </>
            )}
        </div>
      </>
    );
  }
}

export default StateInfo;
