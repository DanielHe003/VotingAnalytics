import React from "react";
import TopBar from "./TopBar";
import MapComponent from "../common/MapComponent";
import Popup from "../common/Popup";
import "./StateInfo.css";
import SummaryComponent from "./SummaryComponent";
import CDSummary from "./CDSummary";
import ApiService from "../common/ApiService";
import ChartContainer from '../common/ChartContainer';
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

    if(prevProps.selectedTrend !== this.props.selectTrend && this.props.selectedTrend === "ComparePlans"){

        if(this.state.mapData !== null) this.setState({mapData: null})
        if(prevProps.selectedSubTrend !== this.props.selectedSubTrend){
           this.fetchComparePlans(1);
          //  window.alert("hi");
          }
        if(prevProps.selectedSubSubTrend !== this.props.selectedSubSubTrend){
          this.fetchComparePlans(2);
          // window.alert("hi");
       }


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

  fetchComparePlans = async (type) => {
    try {
      const { selectedState, selectedSubTrend, selectedSubSubTrend } = this.props;
  
      if (!selectedState) return;
  
      const stateId = selectedState === "Alabama" ? 1 : 6;
      const trendId = type === 1 ? selectedSubTrend : selectedSubSubTrend;
  
      const statePlans = {
        Alabama: [
          { planId: "minIncomeDeviation1", planNum: 554 },
          { planId: "minIncomeDeviation2", planNum: 3098 },
          { planId: "maxIncomeDeviation1", planNum: 4627 },
          { planId: "maxIncomeDeviation2", planNum: 4141 },
          { planId: "heavilyRural1", planNum: 3123 },
          { planId: "heavilyRural2", planNum: 3122 },
          { planId: "heavilyRural3", planNum: 3121 },
          { planId: "heavilyRural4", planNum: 3120 },
          { planId: "enacted", planNum: 0 }
        ],
        California: [
          { planId: "heavilyUrban1", planNum: 3104 },
          { planId: "heavilyUrban2", planNum: 3746 },
          { planId: "heavilyUrban3", planNum: 1900 },
          { planId: "minIncomeDeviation1", planNum: 1202 },
          { planId: "minIncomeDeviation2", planNum: 3138 },
          { planId: "maxIncomeDeviation1", planNum: 1935 },
          { planId: "maxIncomeDeviation2", planNum: 608 },
          { planId: "heavilySuburban1", planNum: 2392 },
          { planId: "heavilySuburban2", planNum: 1461 },
          { planId: "heavilyRural1", planNum: 2185 },
          { planId: "heavilyRural2", planNum: 1483 },
          { planId: "heavilyRural3", planNum: 1472 },
          { planId: "enacted", planNum: 0 }
        ]
      };
  
      const plans = statePlans[selectedState];
      if (!plans) throw new Error("State plans not found.");
  
      const selectedPlan = plans.find(plan => plan.planId === trendId);
      if (!selectedPlan) throw new Error("Trend ID does not match any plan.");
  
      const planNumber = selectedPlan.planNum;
      const url = `${stateId}/districtPlans/num/${planNumber}/geojson`;
  
      const { data } = await axios.get(url);
      console.log(data);
      if (type === 1) {
        this.setState({ comparePlan2: data });
      } else if (type === 2) {
        this.setState({ comparePlan: data });
      }
  
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Error: The specified plan ID does not exist (404 Not Found).");
      } else {
        console.error("Error fetching GeoJSON data:", error);
      }
    }
  };
  
  
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
  
  
  toUpperCase(str) {
    if (str.length === 0) return str; // Handle empty string case
    return str.charAt(0).toUpperCase() + str.slice(1);
}


  fetchPrecinctHeatMap = async () => {
    try {
      const { selectedState, selectedSubTrend, selectedSubSubTrend} = this.props;
  
      // Check if required props are set
      if (!selectedState || !selectedSubTrend || selectedSubSubTrend === " ") return;
  
      const stateId = selectedState === "Alabama" ? 1 : 6;
  
      const urlMap = {
        demographic: `states/${stateId}/heatmap/demographic/${selectedSubSubTrend}`,
        economic: `states/${stateId}/heatmap/economic`,
        region: `states/${stateId}/heatmap/region-type`,
        poverty: `states/${stateId}/heatmap/poverty`,
        pil: `states/${stateId}/heatmap/political-income`,
      };
  
      const url = urlMap[selectedSubTrend];
      if (!url) return; // Check if the URL for the selected trend exists
  
      const { data } = await axios.get(url);
      this.setState({ tableData: null }, () => {
        // console.log('Updated tableData:', this.state.tableData);
      });

      const tableMap = {
        economic: {
          title: `Precinct by Median Income`,
          type: "table",
          labels: ["Precinct #", "Median Income"],
          values: data.data
            .sort((a, b) => (b.medianIncome || 0) - (a.medianIncome || 0))
            .map(entry => ({
              "Precinct #": entry.precinctKey || 0,
              "Median Income": `$${(entry.medianIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            })),
        },
        demographic: {
          title: `Precinct by Demographic: ${this.toUpperCase(this.props.selectedSubSubTrend)}`,
          type: "table",
          labels: ["Precinct #", "Population %"],
          values: data.data
            .map(entry => ({
              "Precinct #": entry.precinctKey || 0,
              "Population %": (entry.percentage || 0).toFixed(2),
            }))
            .sort((a, b) => (b["Population %"] || 0) - (a["Population %"] || 0)),
        },
        region: {
          title: `Precinct by Region`,
          type: "table",
          labels: ["Precinct #", "Region Type"],
          values: data.data.map(entry => ({
            "Precinct #": entry.precinctKey || 0,
            "Region Type": entry.type || 0,
          })),
        },
        poverty: {
          title: `Precinct by Poverty %`,
          type: "table",
          labels: ["Precinct #", "Poverty %"],
          values: data.data
            .sort((a, b) => (b.povertyPercentage || 0) - (a.povertyPercentage || 0))
            .map(entry => ({
              "Precinct #": entry.precinctKey || 0,
              "Poverty %": (entry.povertyPercentage || 0).toFixed(2),
            })),
        },
        pil: {
          title: `Precinct by Political-Income`,
          type: "table",
          labels: ["Precinct #", "Dominant Party", "Median Income Range"],
          values: data.data.map(entry => ({
            "Precinct #": entry.precinctKey || 0,
            "Dominant Party": entry.dominantParty || 0,
            "Median Income Range": entry.bin || 0,
          })),
        },
      };
      
  
      this.setState({ tableData: tableMap[selectedSubTrend] }, () => {
        console.log('Updated tableData:', this.state.tableData);
      });
      
  
      // Update map data by matching precinct data
      this.setState(prevState => ({
        mapData: {
          type: "FeatureCollection",
          features: prevState.mapData.features.map(feature => {
            const matchingData = data.data.find(entry => entry.precinctKey === feature.properties.precinctKey);
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
      }));
  
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
          "Rep. Name": district.representative,
          "Rep. Party": district.party,
          "Avg. Household Income": `$${district.averageHouseholdIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          "Poverty %": district.povertyPercentage.toFixed(2),
          "Vote Margin %": district.voteMarginPercentage.toFixed(2),
          "Urban %": district.urbanPercentage.toFixed(2),
          "Suburban %": district.suburbanPercentage.toFixed(2),
          "Rural %": district.ruralPercentage.toFixed(2),          
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


      const sortedData = data.sort((a, b) => a.districtId - b.districtId);

      console.log("Sorted data:", sortedData);

      const districtData = sortedData[selectedDistrictNumber - 1];

      this.setState({tableData: districtData});

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
              geoJsonData={this.props.selectedTrend === "ComparePlans"? this.state.comparePlan2 : this.state.mapData}
              typeRender={this.props.selectedTrend === "ComparePlans" ? true: false}
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
              typeRender={this.props.selectedTrend === "ComparePlans" ? true: false}
              geoJsonData={this.state.comparePlan}
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
                            selectedState={this.props.selectedState}
                          />
                        )}
                      </div>
                    )}

                  {this.props.selectedTrend === "precinct"  && this.state.tableData && (<>
                  <center>

                  <ChartContainer 
                  title={this.state.tableData.title}
                  height={300}
                  width={700}
                  titleRender={true}
                  type="table"
                  minCount={8}
                  data={{
                    values: this.state.tableData.values,
                    labels: this.state.tableData.labels
                  }}
            />
                              </center>



            </>)}

                </div>
                <div className="button-container">
                  {this.props.selectedState && this.props.selectedTrend !== "precinct" && (
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
