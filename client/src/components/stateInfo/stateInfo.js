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

  hoverEffect = (value, truth) => {
      this.setState({boldItem: value})  
  };

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

      const AlabamaData=[
        [
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          },
          {
            pctDem: 72.06929875648795,
            pctRep: 27.93070124351204,
            demVotes: 225218,
            repVotes: 87284,
            totalVotes: 312502,
            totalPopulation: 602466,
            whitePop: 225241,
            blackPop: 69262,
            hispanicPop: 156278,
            asianPop: 104149,
            americanIndianAlaskaNativePop: 3147,
            hawaiianPacificIslanderPop: 8541,
            otherPop: 3730,
            twoOrMorePop: 32118,
            incomeDistribution: {
              'Under $25K': 37091,
              '$25K-$50K': 54809,
              '$50K-$100K': 88053,
              '$100K-$200K': 66433,
              '$200K+': 21902
            },
            medianIncome: 74680.36484480432
          }
        ]
      ];
          const CaliforniaData=[
            {
              pctDem: 42.22333184857761,
              pctRep: 57.776668151422385,
              demVotes: 148825,
              repVotes: 203646,
              totalVotes: 352471,
              totalPopulation: 561378,
              whitePop: 419292,
              blackPop: 7508,
              hispanicPop: 74685,
              asianPop: 16050,
              americanIndianAlaskaNativePop: 9612,
              hawaiianPacificIslanderPop: 1175,
              otherPop: 3005,
              twoOrMorePop: 30051,
              incomeDistribution: {
                'Under $25K': 39852,
                '$25K-$50K': 60033,
                '$50K-$100K': 81079,
                '$100K-$200K': 59789,
                '$200K+': 19388
              },
              medianIncome: 62413.234431137724
            },
            {
              pctDem: 75.48154926220117,
              pctRep: 24.51845073779883,
              demVotes: 294489,
              repVotes: 95658,
              totalVotes: 390147,
              totalPopulation: 577442,
              whitePop: 400438,
              blackPop: 9493,
              hispanicPop: 98464,
              asianPop: 24849,
              americanIndianAlaskaNativePop: 10841,
              hawaiianPacificIslanderPop: 1162,
              otherPop: 3934,
              twoOrMorePop: 28261,
              incomeDistribution: {
                'Under $25K': 29222,
                '$25K-$50K': 45191,
                '$50K-$100K': 68061,
                '$100K-$200K': 71449,
                '$200K+': 51192
              },
              medianIncome: 92635.27721986485
            },
            {
              pctDem: 56.27008740662388,
              pctRep: 43.72991259337613,
              demVotes: 179806,
              repVotes: 139735,
              totalVotes: 319541,
              totalPopulation: 587284,
              whitePop: 274561,
              blackPop: 35780,
              hispanicPop: 163954,
              asianPop: 71839,
              americanIndianAlaskaNativePop: 4366,
              hawaiianPacificIslanderPop: 3130,
              otherPop: 3277,
              twoOrMorePop: 30377,
              incomeDistribution: {
                'Under $25K': 25052,
                '$25K-$50K': 44487,
                '$50K-$100K': 76830,
                '$100K-$200K': 71178,
                '$200K+': 25794
              },
              medianIncome: 81366.36668443496
            },
            {
              pctDem: 45.01034185185354,
              pctRep: 54.98965814814646,
              demVotes: 197157,
              repVotes: 240869,
              totalVotes: 438026,
              totalPopulation: 606671,
              whitePop: 445695,
              blackPop: 8782,
              hispanicPop: 75926,
              asianPop: 35879,
              americanIndianAlaskaNativePop: 5405,
              hawaiianPacificIslanderPop: 1193,
              otherPop: 3251,
              twoOrMorePop: 30540,
              incomeDistribution: {
                'Under $25K': 26363,
                '$25K-$50K': 44204,
                '$50K-$100K': 80632,
                '$100K-$200K': 85141,
                '$200K+': 43720
              },
              medianIncome: 86339.48619385566
            },
            {
              pctDem: 74.14660438375853,
              pctRep: 25.853395616241464,
              demVotes: 264128,
              repVotes: 92096,
              totalVotes: 356224,
              totalPopulation: 582140,
              whitePop: 286842,
              blackPop: 35597,
              hispanicPop: 153167,
              asianPop: 71027,
              americanIndianAlaskaNativePop: 3269,
              hawaiianPacificIslanderPop: 2899,
              otherPop: 3597,
              twoOrMorePop: 25742,
              incomeDistribution: {
                'Under $25K': 21628,
                '$25K-$50K': 40963,
                '$50K-$100K': 75806,
                '$100K-$200K': 84426,
                '$200K+': 36550
              },
              medianIncome: 94948.28518029903
            },
            {
              pctDem: 72.06929875648795,
              pctRep: 27.93070124351204,
              demVotes: 225218,
              repVotes: 87284,
              totalVotes: 312502,
              totalPopulation: 602466,
              whitePop: 225241,
              blackPop: 69262,
              hispanicPop: 156278,
              asianPop: 104149,
              americanIndianAlaskaNativePop: 3147,
              hawaiianPacificIslanderPop: 8541,
              otherPop: 3730,
              twoOrMorePop: 32118,
              incomeDistribution: {
                'Under $25K': 37091,
                '$25K-$50K': 54809,
                '$50K-$100K': 88053,
                '$100K-$200K': 66433,
                '$200K+': 21902
              },
              medianIncome: 74680.36484480432
            },
            {
              pctDem: 57.07568768331899,
              pctRep: 42.92431231668101,
              demVotes: 218137,
              repVotes: 164052,
              totalVotes: 382189,
              totalPopulation: 606143,
              whitePop: 310354,
              blackPop: 42285,
              hispanicPop: 98026,
              asianPop: 110078,
              americanIndianAlaskaNativePop: 2725,
              hawaiianPacificIslanderPop: 5441,
              otherPop: 3642,
              twoOrMorePop: 33592,
              incomeDistribution: {
                'Under $25K': 21707,
                '$25K-$50K': 41494,
                '$50K-$100K': 80138,
                '$100K-$200K': 85443,
                '$200K+': 33826
              },
              medianIncome: 98570.16553672316
            },
            {
              pctDem: 44.638495487090246,
              pctRep: 55.361504512909754,
              demVotes: 127746,
              repVotes: 158433,
              totalVotes: 286179,
              totalPopulation: 562741,
              whitePop: 249681,
              blackPop: 43542,
              hispanicPop: 215792,
              asianPop: 21919,
              americanIndianAlaskaNativePop: 5501,
              hawaiianPacificIslanderPop: 2120,
              otherPop: 3258,
              twoOrMorePop: 20928,
              incomeDistribution: {
                'Under $25K': 32233,
                '$25K-$50K': 53595,
                '$50K-$100K': 75622,
                '$100K-$200K': 51031,
                '$200K+': 12498
              },
              medianIncome: 65667.26364985164
            },
            {
              pctDem: 59.202961199996054,
              pctRep: 40.797038800003946,
              demVotes: 180096,
              repVotes: 124105,
              totalVotes: 304201,
              totalPopulation: 593077,
              whitePop: 193688,
              blackPop: 53861,
              hispanicPop: 215520,
              asianPop: 97155,
              americanIndianAlaskaNativePop: 2381,
              hawaiianPacificIslanderPop: 3905,
              otherPop: 3007,
              twoOrMorePop: 23560,
              incomeDistribution: {
                'Under $25K': 23674,
                '$25K-$50K': 41390,
                '$50K-$100K': 71909,
                '$100K-$200K': 68415,
                '$200K+': 24208
              },
              medianIncome: 92494.06881242977
            },
            {
              pctDem: 51.47903837594744,
              pctRep: 48.52096162405256,
              demVotes: 154990,
              repVotes: 146084,
              totalVotes: 301074,
              totalPopulation: 568639,
              whitePop: 233446,
              blackPop: 18953,
              hispanicPop: 232776,
              asianPop: 51044,
              americanIndianAlaskaNativePop: 2884,
              hawaiianPacificIslanderPop: 4141,
              otherPop: 2839,
              twoOrMorePop: 22556,
              incomeDistribution: {
                'Under $25K': 25306,
                '$25K-$50K': 44450,
                '$50K-$100K': 74501,
                '$100K-$200K': 65008,
                '$200K+': 20268
              },
              medianIncome: 74991.38482623312
            },
            {
              pctDem: 75.89765029184952,
              pctRep: 24.102349708150484,
              demVotes: 285023,
              repVotes: 90513,
              totalVotes: 375536,
              totalPopulation: 599924,
              whitePop: 265089,
              blackPop: 48392,
              hispanicPop: 153434,
              asianPop: 98533,
              americanIndianAlaskaNativePop: 1238,
              hawaiianPacificIslanderPop: 2718,
              otherPop: 4177,
              twoOrMorePop: 26343,
              incomeDistribution: {
                'Under $25K': 19247,
                '$25K-$50K': 34389,
                '$50K-$100K': 66010,
                '$100K-$200K': 84645,
                '$200K+': 64849
              },
              medianIncome: 121543.44749776585
            },
            {
              pctDem: 87.86570693335977,
              pctRep: 12.13429306664022,
              demVotes: 336668,
              repVotes: 46494,
              totalVotes: 383162,
              totalPopulation: 672833,
              whitePop: 285738,
              blackPop: 34926,
              hispanicPop: 95278,
              asianPop: 219707,
              americanIndianAlaskaNativePop: 1291,
              hawaiianPacificIslanderPop: 2387,
              otherPop: 4703,
              twoOrMorePop: 28803,
              incomeDistribution: {
                'Under $25K': 32788,
                '$25K-$50K': 33629,
                '$50K-$100K': 55533,
                '$100K-$200K': 85836,
                '$200K+': 104451
              },
              medianIncome: 130518.7947565543
            },
            {
              pctDem: 90.82081006229375,
              pctRep: 9.179189937706258,
              demVotes: 335473,
              repVotes: 33906,
              totalVotes: 369379,
              totalPopulation: 638688,
              whitePop: 222176,
              blackPop: 97925,
              hispanicPop: 135541,
              asianPop: 142649,
              americanIndianAlaskaNativePop: 1658,
              hawaiianPacificIslanderPop: 3057,
              otherPop: 4221,
              twoOrMorePop: 31461,
              incomeDistribution: {
                'Under $25K': 29555,
                '$25K-$50K': 41392,
                '$50K-$100K': 67771,
                '$100K-$200K': 77942,
                '$200K+': 59611
              },
              medianIncome: 108871.94236723497
            },
            {
              pctDem: 79.15612171484193,
              pctRep: 20.84387828515807,
              demVotes: 280557,
              repVotes: 73878,
              totalVotes: 354435,
              totalPopulation: 603755,
              whitePop: 201153,
              blackPop: 15885,
              hispanicPop: 134830,
              asianPop: 217741,
              americanIndianAlaskaNativePop: 857,
              hawaiianPacificIslanderPop: 6732,
              otherPop: 4330,
              twoOrMorePop: 22227,
              incomeDistribution: {
                'Under $25K': 14547,
                '$25K-$50K': 26350,
                '$50K-$100K': 51560,
                '$100K-$200K': 78603,
                '$200K+': 79523
              },
              medianIncome: 137907.50456349205
            },
            {
              pctDem: 73.01531038110157,
              pctRep: 26.98468961889843,
              demVotes: 255428,
              repVotes: 94400,
              totalVotes: 349828,
              totalPopulation: 614125,
              whitePop: 183399,
              blackPop: 31556,
              hispanicPop: 131724,
              asianPop: 232513,
              americanIndianAlaskaNativePop: 1495,
              hawaiianPacificIslanderPop: 6520,
              otherPop: 2931,
              twoOrMorePop: 23987,
              incomeDistribution: {
                'Under $25K': 12912,
                '$25K-$50K': 23000,
                '$50K-$100K': 54204,
                '$100K-$200K': 84118,
                '$200K+': 75660
              },
              medianIncome: 149990.8350292631
            },
            {
              pctDem: 60.18363124985472,
              pctRep: 39.81636875014527,
              demVotes: 129458,
              repVotes: 85647,
              totalVotes: 215105,
              totalPopulation: 529888,
              whitePop: 122745,
              blackPop: 28245,
              hispanicPop: 310917,
              asianPop: 49122,
              americanIndianAlaskaNativePop: 3365,
              hawaiianPacificIslanderPop: 872,
              otherPop: 2451,
              twoOrMorePop: 12171,
              incomeDistribution: {
                'Under $25K': 36467,
                '$25K-$50K': 51344,
                '$50K-$100K': 65099,
                '$100K-$200K': 39052,
                '$200K+': 9649
              },
              medianIncome: 60658.030409537554
            },
            {
              pctDem: 73.93945969404362,
              pctRep: 26.060540305956387,
              demVotes: 224895,
              repVotes: 79266,
              totalVotes: 304161,
              totalPopulation: 620922,
              whitePop: 134063,
              blackPop: 11630,
              hispanicPop: 88879,
              asianPop: 363587,
              americanIndianAlaskaNativePop: 738,
              hawaiianPacificIslanderPop: 2354,
              otherPop: 2927,
              twoOrMorePop: 16744,
              incomeDistribution: {
                'Under $25K': 12956,
                '$25K-$50K': 18209,
                '$50K-$100K': 42956,
                '$100K-$200K': 86788,
                '$200K+': 96516
              },
              medianIncome: 161334.5718088624
            },
            {
              pctDem: 78.18848773444176,
              pctRep: 21.81151226555823,
              demVotes: 294572,
              repVotes: 82174,
              totalVotes: 376746,
              totalPopulation: 592221,
              whitePop: 304440,
              blackPop: 10976,
              hispanicPop: 91025,
              asianPop: 155524,
              americanIndianAlaskaNativePop: 893,
              hawaiianPacificIslanderPop: 1890,
              otherPop: 3313,
              twoOrMorePop: 24160,
              incomeDistribution: {
                'Under $25K': 14154,
                '$25K-$50K': 22952,
                '$50K-$100K': 46596,
                '$100K-$200K': 71422,
                '$200K+': 107163
              },
              medianIncome: 170206.59853479854
            },
            {
              pctDem: 71.48110099099212,
              pctRep: 28.51889900900788,
              demVotes: 228222,
              repVotes: 91054,
              totalVotes: 319276,
              totalPopulation: 587678,
              whitePop: 151129,
              blackPop: 16710,
              hispanicPop: 211902,
              asianPop: 185122,
              americanIndianAlaskaNativePop: 1388,
              hawaiianPacificIslanderPop: 2016,
              otherPop: 2731,
              twoOrMorePop: 16680,
              incomeDistribution: {
                'Under $25K': 15104,
                '$25K-$50K': 26167,
                '$50K-$100K': 52153,
                '$100K-$200K': 71892,
                '$200K+': 58325
              },
              medianIncome: 131479.82237521515
            },
            {
              pctDem: 74.39171790425141,
              pctRep: 25.608282095748596,
              demVotes: 226496,
              repVotes: 77968,
              totalVotes: 304464,
              totalPopulation: 569273,
              whitePop: 216810,
              blackPop: 11032,
              hispanicPop: 282265,
              asianPop: 33593,
              americanIndianAlaskaNativePop: 1943,
              hawaiianPacificIslanderPop: 1864,
              otherPop: 2789,
              twoOrMorePop: 18977,
              incomeDistribution: {
                'Under $25K': 19817,
                '$25K-$50K': 36717,
                '$50K-$100K': 68047,
                '$100K-$200K': 65276,
                '$200K+': 33708
              },
              medianIncome: 90567.24771505376
            },
            {
              pctDem: 55.551927039110794,
              pctRep: 44.44807296088921,
              demVotes: 93560,
              repVotes: 74859,
              totalVotes: 168419,
              totalPopulation: 498068,
              whitePop: 87630,
              blackPop: 19724,
              hispanicPop: 358292,
              asianPop: 19546,
              americanIndianAlaskaNativePop: 2613,
              hawaiianPacificIslanderPop: 478,
              otherPop: 1886,
              twoOrMorePop: 7899,
              incomeDistribution: {
                'Under $25K': 29873,
                '$25K-$50K': 50296,
                '$50K-$100K': 57042,
                '$100K-$200K': 30588,
                '$200K+': 5304
              },
              medianIncome: 49321.23059318555
            },
            {
              pctDem: 47.23964767086705,
              pctRep: 52.76035232913296,
              demVotes: 146467,
              repVotes: 163584,
              totalVotes: 310051,
              totalPopulation: 574658,
              whitePop: 224554,
              blackPop: 15894,
              hispanicPop: 257525,
              asianPop: 52910,
              americanIndianAlaskaNativePop: 3134,
              hawaiianPacificIslanderPop: 730,
              otherPop: 2806,
              twoOrMorePop: 17105,
              incomeDistribution: {
                'Under $25K': 26803,
                '$25K-$50K': 50225,
                '$50K-$100K': 78465,
                '$100K-$200K': 64360,
                '$200K+': 20414
              },
              medianIncome: 77194.63131001372
            },
            {
              pctDem: 41.48453799741941,
              pctRep: 58.5154620025806,
              demVotes: 125068,
              repVotes: 176413,
              totalVotes: 301481,
              totalPopulation: 568986,
              whitePop: 251129,
              blackPop: 35037,
              hispanicPop: 220032,
              asianPop: 33192,
              americanIndianAlaskaNativePop: 4787,
              hawaiianPacificIslanderPop: 988,
              otherPop: 3035,
              twoOrMorePop: 20786,
              incomeDistribution: {
                'Under $25K': 34188,
                '$25K-$50K': 50641,
                '$50K-$100K': 74241,
                '$100K-$200K': 61542,
                '$200K+': 17997
              },
              medianIncome: 75487.39339339339
            },
            {
              pctDem: 62.20008355741488,
              pctRep: 37.79991644258512,
              demVotes: 221831,
              repVotes: 134810,
              totalVotes: 356641,
              totalPopulation: 590734,
              whitePop: 325077,
              blackPop: 9688,
              hispanicPop: 196030,
              asianPop: 31861,
              americanIndianAlaskaNativePop: 2397,
              hawaiianPacificIslanderPop: 716,
              otherPop: 3186,
              twoOrMorePop: 21779,
              incomeDistribution: {
                'Under $25K': 23444,
                '$25K-$50K': 42051,
                '$50K-$100K': 72755,
                '$100K-$200K': 73009,
                '$200K+': 34827
              },
              medianIncome: 95077.9656381674
            },
            {
              pctDem: 55.16133943052538,
              pctRep: 44.83866056947461,
              demVotes: 188419,
              repVotes: 153159,
              totalVotes: 341578,
              totalPopulation: 570285,
              whitePop: 228492,
              blackPop: 43753,
              hispanicPop: 220684,
              asianPop: 51792,
              americanIndianAlaskaNativePop: 1622,
              hawaiianPacificIslanderPop: 835,
              otherPop: 3289,
              twoOrMorePop: 19818,
              incomeDistribution: {
                'Under $25K': 18743,
                '$25K-$50K': 36813,
                '$50K-$100K': 62378,
                '$100K-$200K': 68979,
                '$200K+': 30616
              },
              medianIncome: 100241.99731993298
            },
            {
              pctDem: 62.71510958658468,
              pctRep: 37.28489041341532,
              demVotes: 216840,
              repVotes: 128914,
              totalVotes: 345754,
              totalPopulation: 558326,
              whitePop: 250338,
              blackPop: 9807,
              hispanicPop: 233000,
              asianPop: 42257,
              americanIndianAlaskaNativePop: 1392,
              hawaiianPacificIslanderPop: 1014,
              otherPop: 2699,
              twoOrMorePop: 17819,
              incomeDistribution: {
                'Under $25K': 16847,
                '$25K-$50K': 35866,
                '$50K-$100K': 64315,
                '$100K-$200K': 72978,
                '$200K+': 37309
              },
              medianIncome: 102061.03757575757
            },
            {
              pctDem: 68.52983416227003,
              pctRep: 31.470165837729976,
              demVotes: 226659,
              repVotes: 104086,
              totalVotes: 330745,
              totalPopulation: 581143,
              whitePop: 153855,
              blackPop: 22680,
              hispanicPop: 150278,
              asianPop: 235894,
              americanIndianAlaskaNativePop: 834,
              hawaiianPacificIslanderPop: 430,
              otherPop: 2394,
              twoOrMorePop: 14778,
              incomeDistribution: {
                'Under $25K': 22038,
                '$25K-$50K': 35256,
                '$50K-$100K': 65545,
                '$100K-$200K': 71360,
                '$200K+': 40356
              },
              medianIncome: 101713.28596938775
            },
            {
              pctDem: 72.23908842463952,
              pctRep: 27.76091157536048,
              demVotes: 252701,
              repVotes: 97111,
              totalVotes: 349812,
              totalPopulation: 608108,
              whitePop: 346603,
              blackPop: 18025,
              hispanicPop: 136582,
              asianPop: 80409,
              americanIndianAlaskaNativePop: 889,
              hawaiianPacificIslanderPop: 470,
              otherPop: 3435,
              twoOrMorePop: 21695,
              incomeDistribution: {
                'Under $25K': 39698,
                '$25K-$50K': 47150,
                '$50K-$100K': 77273,
                '$100K-$200K': 74820,
                '$200K+': 44470
              },
              medianIncome: 91274.20055555555
            },
            {
              pctDem: 75.78938399240438,
              pctRep: 24.210616007595615,
              demVotes: 186789,
              repVotes: 59669,
              totalVotes: 246458,
              totalPopulation: 554961,
              whitePop: 119189,
              blackPop: 22095,
              hispanicPop: 350390,
              asianPop: 49418,
              americanIndianAlaskaNativePop: 954,
              hawaiianPacificIslanderPop: 547,
              otherPop: 2640,
              twoOrMorePop: 9728,
              incomeDistribution: {
                'Under $25K': 28723,
                '$25K-$50K': 43273,
                '$50K-$100K': 63624,
                '$100K-$200K': 48663,
                '$200K+': 14104
              },
              medianIncome: 71021.44447619047
            },
            {
              pctDem: 70.00454255399691,
              pctRep: 29.995457446003094,
              demVotes: 258902,
              repVotes: 110934,
              totalVotes: 369836,
              totalPopulation: 608652,
              whitePop: 306755,
              blackPop: 27893,
              hispanicPop: 164347,
              asianPop: 81642,
              americanIndianAlaskaNativePop: 872,
              hawaiianPacificIslanderPop: 609,
              otherPop: 3830,
              twoOrMorePop: 22704,
              incomeDistribution: {
                'Under $25K': 25124,
                '$25K-$50K': 40846,
                '$50K-$100K': 71606,
                '$100K-$200K': 81318,
                '$200K+': 49082
              },
              medianIncome: 107556.34522653722
            },
            {
              pctDem: 60.18553067993366,
              pctRep: 39.81446932006634,
              demVotes: 174201,
              repVotes: 115239,
              totalVotes: 289440,
              totalPopulation: 564544,
              whitePop: 147730,
              blackPop: 55849,
              hispanicPop: 288161,
              asianPop: 51180,
              americanIndianAlaskaNativePop: 1740,
              hawaiianPacificIslanderPop: 1518,
              otherPop: 3010,
              twoOrMorePop: 15356,
              incomeDistribution: {
                'Under $25K': 24325,
                '$25K-$50K': 41754,
                '$50K-$100K': 73117,
                '$100K-$200K': 60492,
                '$200K+': 20379
              },
              medianIncome: 82932.06573033708
            },
            {
              pctDem: 66.50703080900145,
              pctRep: 33.49296919099855,
              demVotes: 184978,
              repVotes: 93155,
              totalVotes: 278133,
              totalPopulation: 555895,
              whitePop: 87670,
              blackPop: 13962,
              hispanicPop: 323091,
              asianPop: 118451,
              americanIndianAlaskaNativePop: 1182,
              hawaiianPacificIslanderPop: 605,
              otherPop: 2169,
              twoOrMorePop: 8765,
              incomeDistribution: {
                'Under $25K': 19179,
                '$25K-$50K': 33909,
                '$50K-$100K': 61249,
                '$100K-$200K': 58618,
                '$200K+': 17353
              },
              medianIncome: 86224.44796954315
            },
            {
              pctDem: 70.38669190943132,
              pctRep: 29.613308090568673,
              demVotes: 285903,
              repVotes: 120286,
              totalVotes: 406189,
              totalPopulation: 600397,
              whitePop: 384839,
              blackPop: 19076,
              hispanicPop: 73867,
              asianPop: 89716,
              americanIndianAlaskaNativePop: 969,
              hawaiianPacificIslanderPop: 837,
              otherPop: 4136,
              twoOrMorePop: 26957,
              incomeDistribution: {
                'Under $25K': 20173,
                '$25K-$50K': 29518,
                '$50K-$100K': 59437,
                '$100K-$200K': 82850,
                '$200K+': 87975
              },
              medianIncome: 138349.97349593494
            },
            {
              pctDem: 82.70128230285553,
              pctRep: 17.29871769714447,
              demVotes: 193870,
              repVotes: 40552,
              totalVotes: 234422,
              totalPopulation: 576490,
              whitePop: 85554,
              blackPop: 31703,
              hispanicPop: 318125,
              asianPop: 124181,
              americanIndianAlaskaNativePop: 1334,
              hawaiianPacificIslanderPop: 437,
              otherPop: 2737,
              twoOrMorePop: 12419,
              incomeDistribution: {
                'Under $25K': 43466,
                '$25K-$50K': 54921,
                '$50K-$100K': 71495,
                '$100K-$200K': 48239,
                '$200K+': 17444
              },
              medianIncome: 63757.6103773585
            },
            {
              pctDem: 66.61793977356012,
              pctRep: 33.38206022643988,
              demVotes: 166339,
              repVotes: 83352,
              totalVotes: 249691,
              totalPopulation: 553600,
              whitePop: 77979,
              blackPop: 34928,
              hispanicPop: 370146,
              asianPop: 56158,
              americanIndianAlaskaNativePop: 1444,
              hawaiianPacificIslanderPop: 1054,
              otherPop: 2437,
              twoOrMorePop: 9454,
              incomeDistribution: {
                'Under $25K': 20615,
                '$25K-$50K': 35600,
                '$50K-$100K': 69915,
                '$100K-$200K': 55909,
                '$200K+': 11883
              },
              medianIncome: 79086.53913043479
            },
            {
              pctDem: 56.93213984656107,
              pctRep: 43.06786015343893,
              demVotes: 173573,
              repVotes: 131304,
              totalVotes: 304877,
              totalPopulation: 593145,
              whitePop: 253699,
              blackPop: 25872,
              hispanicPop: 268407,
              asianPop: 22308,
              americanIndianAlaskaNativePop: 4184,
              hawaiianPacificIslanderPop: 905,
              otherPop: 2448,
              twoOrMorePop: 15322,
              incomeDistribution: {
                'Under $25K': 42964,
                '$25K-$50K': 62937,
                '$50K-$100K': 76659,
                '$100K-$200K': 54842,
                '$200K+': 20513
              },
              medianIncome: 62005.520932636166
            },
            {
              pctDem: 85.90868280273838,
              pctRep: 14.091317197261608,
              demVotes: 275571,
              repVotes: 45201,
              totalVotes: 320772,
              totalPopulation: 590776,
              whitePop: 164219,
              blackPop: 120476,
              hispanicPop: 208979,
              asianPop: 66659,
              americanIndianAlaskaNativePop: 997,
              hawaiianPacificIslanderPop: 696,
              otherPop: 4994,
              twoOrMorePop: 23756,
              incomeDistribution: {
                'Under $25K': 34534,
                '$25K-$50K': 47887,
                '$50K-$100K': 71733,
                '$100K-$200K': 65544,
                '$200K+': 34315
              },
              medianIncome: 78121.84374057314
            },
            {
              pctDem: 67.01968872326029,
              pctRep: 32.98031127673972,
              demVotes: 206995,
              repVotes: 101862,
              totalVotes: 308857,
              totalPopulation: 555749,
              whitePop: 88652,
              blackPop: 20497,
              hispanicPop: 334753,
              asianPop: 96424,
              americanIndianAlaskaNativePop: 1455,
              hawaiianPacificIslanderPop: 1748,
              otherPop: 2141,
              twoOrMorePop: 10079,
              incomeDistribution: {
                'Under $25K': 18350,
                '$25K-$50K': 33805,
                '$50K-$100K': 60895,
                '$100K-$200K': 64201,
                '$200K+': 20073
              },
              medianIncome: 87950.41243654823
            },
            {
              pctDem: 55.17393512807488,
              pctRep: 44.82606487192511,
              demVotes: 190088,
              repVotes: 154437,
              totalVotes: 344525,
              totalPopulation: 582232,
              whitePop: 166833,
              blackPop: 13083,
              hispanicPop: 183496,
              asianPop: 199536,
              americanIndianAlaskaNativePop: 1083,
              hawaiianPacificIslanderPop: 949,
              otherPop: 2315,
              twoOrMorePop: 14937,
              incomeDistribution: {
                'Under $25K': 14530,
                '$25K-$50K': 30919,
                '$50K-$100K': 60206,
                '$100K-$200K': 76799,
                '$200K+': 39665
              },
              medianIncome: 108753.5095138889
            },
            {
              pctDem: 78.9090084871685,
              pctRep: 21.090991512831494,
              demVotes: 156662,
              repVotes: 41873,
              totalVotes: 198535,
              totalPopulation: 508879,
              whitePop: 25043,
              blackPop: 24925,
              hispanicPop: 437121,
              asianPop: 14505,
              americanIndianAlaskaNativePop: 898,
              hawaiianPacificIslanderPop: 620,
              otherPop: 1754,
              twoOrMorePop: 4013,
              incomeDistribution: {
                'Under $25K': 25615,
                '$25K-$50K': 45182,
                '$50K-$100K': 59958,
                '$100K-$200K': 34705,
                '$200K+': 6694
              },
              medianIncome: 61754.3968495935
            },
            {
              pctDem: 63.05273965780138,
              pctRep: 36.947260342198625,
              demVotes: 164579,
              repVotes: 96439,
              totalVotes: 261018,
              totalPopulation: 558580,
              whitePop: 127158,
              blackPop: 49023,
              hispanicPop: 324607,
              asianPop: 36816,
              americanIndianAlaskaNativePop: 1874,
              hawaiianPacificIslanderPop: 1872,
              otherPop: 2805,
              twoOrMorePop: 14425,
              incomeDistribution: {
                'Under $25K': 16321,
                '$25K-$50K': 36395,
                '$50K-$100K': 63638,
                '$100K-$200K': 54516,
                '$200K+': 14201
              },
              medianIncome: 79729.93287888766
            },
            {
              pctDem: 46.234019125520035,
              pctRep: 53.76598087447996,
              demVotes: 170475,
              repVotes: 198247,
              totalVotes: 368722,
              totalPopulation: 606193,
              whitePop: 251917,
              blackPop: 35517,
              hispanicPop: 221118,
              asianPop: 67309,
              americanIndianAlaskaNativePop: 2515,
              hawaiianPacificIslanderPop: 2136,
              otherPop: 2994,
              twoOrMorePop: 22687,
              incomeDistribution: {
                'Under $25K': 16219,
                '$25K-$50K': 31382,
                '$50K-$100K': 70026,
                '$100K-$200K': 84140,
                '$200K+': 35238
              },
              medianIncome: 103619.73666684622
            },
            {
              pctDem: 78.6110382226887,
              pctRep: 21.38896177731129,
              demVotes: 224690,
              repVotes: 61135,
              totalVotes: 285825,
              totalPopulation: 567022,
              whitePop: 89613,
              blackPop: 119019,
              hispanicPop: 250637,
              asianPop: 82378,
              americanIndianAlaskaNativePop: 1026,
              hawaiianPacificIslanderPop: 2561,
              otherPop: 3709,
              twoOrMorePop: 18079,
              incomeDistribution: {
                'Under $25K': 27281,
                '$25K-$50K': 46487,
                '$50K-$100K': 70137,
                '$100K-$200K': 60393,
                '$200K+': 22456
              },
              medianIncome: 77109.13590982286
            },
            {
              pctDem: 80.34639515778899,
              pctRep: 19.653604842211003,
              demVotes: 188761,
              repVotes: 46173,
              totalVotes: 234934,
              totalPopulation: 532724,
              whitePop: 39094,
              blackPop: 81721,
              hispanicPop: 361266,
              asianPop: 35347,
              americanIndianAlaskaNativePop: 970,
              hawaiianPacificIslanderPop: 3537,
              otherPop: 2085,
              twoOrMorePop: 8704,
              incomeDistribution: {
                'Under $25K': 26088,
                '$25K-$50K': 40518,
                '$50K-$100K': 60754,
                '$100K-$200K': 43099,
                '$200K+': 11400
              },
              medianIncome: 68896.23036858974
            },
            {
              pctDem: 55.77147317834752,
              pctRep: 44.22852682165247,
              demVotes: 228624,
              repVotes: 181306,
              totalVotes: 409930,
              totalPopulation: 647628,
              whitePop: 309700,
              blackPop: 11291,
              hispanicPop: 117718,
              asianPop: 177329,
              americanIndianAlaskaNativePop: 770,
              hawaiianPacificIslanderPop: 961,
              otherPop: 3094,
              twoOrMorePop: 26765,
              incomeDistribution: {
                'Under $25K': 16494,
                '$25K-$50K': 29622,
                '$50K-$100K': 63729,
                '$100K-$200K': 93543,
                '$200K+': 71061
              },
              medianIncome: 130703.77123842592
            },
            {
              pctDem: 65.74621671430884,
              pctRep: 34.25378328569115,
              demVotes: 150190,
              repVotes: 78249,
              totalVotes: 228439,
              totalPopulation: 537912,
              whitePop: 97979,
              blackPop: 10263,
              hispanicPop: 332734,
              asianPop: 82651,
              americanIndianAlaskaNativePop: 1015,
              hawaiianPacificIslanderPop: 1735,
              otherPop: 1790,
              twoOrMorePop: 9745,
              incomeDistribution: {
                'Under $25K': 17911,
                '$25K-$50K': 33960,
                '$50K-$100K': 60438,
                '$100K-$200K': 55399,
                '$200K+': 15069
              },
              medianIncome: 83597.67438901486
            },
            {
              pctDem: 63.876332769745694,
              pctRep: 36.123667230254306,
              demVotes: 203632,
              repVotes: 115159,
              totalVotes: 318791,
              totalPopulation: 570174,
              whitePop: 178839,
              blackPop: 39776,
              hispanicPop: 187300,
              asianPop: 136735,
              americanIndianAlaskaNativePop: 1323,
              hawaiianPacificIslanderPop: 3444,
              otherPop: 2827,
              twoOrMorePop: 19930,
              incomeDistribution: {
                'Under $25K': 26118,
                '$25K-$50K': 41356,
                '$50K-$100K': 73097,
                '$100K-$200K': 69258,
                '$200K+': 29005
              },
              medianIncome: 90271.33716814159
            },
            {
              pctDem: 50.75694255671035,
              pctRep: 49.24305744328964,
              demVotes: 199791,
              repVotes: 193832,
              totalVotes: 393623,
              totalPopulation: 589032,
              whitePop: 323539,
              blackPop: 6460,
              hispanicPop: 113553,
              asianPop: 117728,
              americanIndianAlaskaNativePop: 1089,
              hawaiianPacificIslanderPop: 1429,
              otherPop: 2775,
              twoOrMorePop: 22459,
              incomeDistribution: {
                'Under $25K': 19041,
                '$25K-$50K': 33685,
                '$50K-$100K': 64778,
                '$100K-$200K': 82809,
                '$200K+': 58655
              },
              medianIncome: 117509.71748538013
            },
            {
              pctDem: 56.509841699645904,
              pctRep: 43.49015830035409,
              demVotes: 217043,
              repVotes: 167037,
              totalVotes: 384080,
              totalPopulation: 591727,
              whitePop: 354630,
              blackPop: 13451,
              hispanicPop: 144501,
              asianPop: 46954,
              americanIndianAlaskaNativePop: 1764,
              hawaiianPacificIslanderPop: 2756,
              otherPop: 3039,
              twoOrMorePop: 24632,
              incomeDistribution: {
                'Under $25K': 17607,
                '$25K-$50K': 34284,
                '$50K-$100K': 64203,
                '$100K-$200K': 77683,
                '$200K+': 56331
              },
              medianIncome: 125758.29467755975
            },
            {
              pctDem: 46.05429876744282,
              pctRep: 53.94570123255718,
              demVotes: 166834,
              repVotes: 195421,
              totalVotes: 362255,
              totalPopulation: 580990,
              whitePop: 322187,
              blackPop: 15139,
              hispanicPop: 171038,
              asianPop: 38314,
              americanIndianAlaskaNativePop: 5061,
              hawaiianPacificIslanderPop: 1804,
              otherPop: 2846,
              twoOrMorePop: 24601,
              incomeDistribution: {
                'Under $25K': 21409,
                '$25K-$50K': 38874,
                '$50K-$100K': 68657,
                '$100K-$200K': 76330,
                '$200K+': 30500
              },
              medianIncome: 93969.00889427787
            },
            {
              pctDem: 68.50904470525295,
              pctRep: 31.490955294747046,
              demVotes: 163912,
              repVotes: 75344,
              totalVotes: 239256,
              totalPopulation: 535519,
              whitePop: 74829,
              blackPop: 34026,
              hispanicPop: 363629,
              asianPop: 46455,
              americanIndianAlaskaNativePop: 2361,
              hawaiianPacificIslanderPop: 1675,
              otherPop: 1789,
              twoOrMorePop: 10755,
              incomeDistribution: {
                'Under $25K': 31796,
                '$25K-$50K': 47358,
                '$50K-$100K': 62792,
                '$100K-$200K': 41918,
                '$200K+': 8266
              },
              medianIncome: 58288.813101125066
            },
            {
              pctDem: 64.95500464687525,
              pctRep: 35.04499535312474,
              demVotes: 257898,
              repVotes: 139143,
              totalVotes: 397041,
              totalPopulation: 621852,
              whitePop: 349852,
              blackPop: 17538,
              hispanicPop: 85820,
              asianPop: 131289,
              americanIndianAlaskaNativePop: 1383,
              hawaiianPacificIslanderPop: 1758,
              otherPop: 3904,
              twoOrMorePop: 30308,
              incomeDistribution: {
                'Under $25K': 17539,
                '$25K-$50K': 32464,
                '$50K-$100K': 70186,
                '$100K-$200K': 93618,
                '$200K+': 63039
              },
              medianIncome: 125657.37849955296
            },
            {
              pctDem: 68.43480146160638,
              pctRep: 31.565198538393606,
              demVotes: 258830,
              repVotes: 119384,
              totalVotes: 378214,
              totalPopulation: 611616,
              whitePop: 251325,
              blackPop: 43840,
              hispanicPop: 192988,
              asianPop: 86835,
              americanIndianAlaskaNativePop: 1722,
              hawaiianPacificIslanderPop: 3206,
              otherPop: 3218,
              twoOrMorePop: 28482,
              incomeDistribution: {
                'Under $25K': 23740,
                '$25K-$50K': 41798,
                '$50K-$100K': 82307,
                '$100K-$200K': 88414,
                '$200K+': 32161
              },
              medianIncome: 92769.23405043826
            }
          ];
      

      this.setState({ specificDistrict: districtData,
          specificDistrictData2: this.props.selectedState === "Alabama" ? AlabamaData[selectedDistrictNumber-1][0] : CaliforniaData[selectedDistrictNumber-1][0]

      }, () => {
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
              boldItem={this.state.boldItem || 0}
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
                            hoverEffect={this.hoverEffect}
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
        <CDSummary data={this.state.specificDistrict} data1={this.state.specificDistrictData2} />
      </div>
    </>
)}



        </div>
      </>
    );
  }
}

export default StateInfo;
