import React from "react";
import TopBar from "./TopBar";
import ChartContainer from "../common/ChartContainer";
import axios from "axios";
import "./StateAnalysis.css";
axios.defaults.baseURL = "http://localhost:8080/";

class StateAnalysis extends React.Component {
  state = {
    showPopup: false,
    chartData: null,
    dataAvailable: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      
      this.setState({ dataAvailable: false , chartData: null});

      console.log("Updated");
      // if (this.props.selectedSubSubTrend) {
        if (this.props.selectedSubTrend) {

          if (this.props.selectedTrend === "Gingles") {
            // //window.alert("In here");
            this.fetchGingles();
            // this.renderChart();
          } else if (this.props.selectedTrend === "EI") {
            console.log("in ei");
            this.fetchEIData();
            this.renderChart();
          }
          else if (this.props.selectedTrend === "MCMC") {
            console.log("in mcmc");
            this.fetchSeawulf();
          }
        // }
      }
    }
  }


  fetchGingles = async () => {
    try {
      if (!this.props.selectedSubTrend)
        return;

      this.setState({ dataAvailable: false , chartData: null});

      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;

      const urlMap = {
        "race": `states/${stateId}/gingles/race/${this.props.selectedSubSubTrend}`,
        "income": `states/${stateId}/gingles/income${this.props.selectedSubSubTrend ? `?groupName=${this.props.selectedSubSubTrend}`: ""}`,
        "income-race": `states/${stateId}/gingles/income-race/${this.props.selectedSubSubTrend}`,
      };

      if (urlMap[this.props.selectedSubTrend]) {
        console.log(urlMap[this.props.selectedSubTrend]);
        const { data } = await axios.get(urlMap[this.props.selectedSubTrend]);
        console.log(urlMap[this.props.selectedSubTrend]);
        console.log(data);
        this.setState({ chartData: data, dataAvailable: true });
      }
    } catch (error) {
      console.error("Error fetching Gingles analysis:", error);
      this.setState({ dataAvailable: false });
    }
  };

  fetchSeawulf = async () => {
    try {
      this.setState({ dataAvailable: false, chartData: null });
  
      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;
      
          const urlMap = {
            racial: `${stateId}/boxwhisker/race?groupName=${this.props.selectedSubSubTrend.toLowerCase()}`,
            economic: `${stateId}/boxwhisker/economic?groupName=${this.props.selectedSubSubTrend.toLowerCase()}_income`,
            region: `${stateId}/boxwhisker/region?&groupName=${this.props.selectedSubSubTrend.toLowerCase()}_population`,
          };
            
      console.log("map created");
  
      if (urlMap[this.props.selectedSubTrend]) {
        console.log(urlMap[this.props.selectedSubTrend]);
        const {data} = await axios.get(urlMap[this.props.selectedSubTrend]);
        this.setState({
          chartData: data,
          dataAvailable: true,
        });

        console.log("Seawulf Data:", data);
      }
    } catch (error) {
      console.error("Error fetching EI analysis:", error);
      this.setState({ dataAvailable: false });
    }
  };

  fetchEIData = async () => {
    try {
      this.setState({ dataAvailable: false, chartData: null });
      //window.alert("in");
  
      const stateId =
        this.props.selectedState === "Alabama"
          ? 1
          : this.props.selectedState === "California"
          ? 6
          : null;
      
      const subsubtrend = this.props.selectedSubSubTrend.replace(/middle/gi, 'mid');
      console.log(subsubtrend);
      
      const urlMap = {
        racial: `${stateId}/ei-analysis/racial?racialGroup=${this.props.selectedSubSubTrend}&candidateName=`,
        economic:`${stateId}/ei-analysis/economic?economicGroup=${subsubtrend}&candidateName=`,
        region: `${stateId}/ei-analysis/region?regionGroup=${this.props.selectedSubTrend}&candidateName=`,
      }; 
  
      //window.alert("till here");
      console.log(this.props.selectedSubTrend);
      if (urlMap[this.props.selectedSubTrend]) {
        console.log(urlMap[this.props.selectedSubTrend]);
        const bidenUrl = `${urlMap[this.props.selectedSubTrend]}Biden`;
        const trumpUrl = `${urlMap[this.props.selectedSubTrend]}Trump`;
        console.log("into here");
        const [bidenData, trumpData] = await Promise.all([
          axios.get(bidenUrl),
          axios.get(trumpUrl),
        ]);
  
        this.setState({
          chartData: { bidenData: bidenData.data, trumpData: trumpData.data },
          dataAvailable: true,
        });
        // console.log("Biden Data:", bidenData.data);
        // console.log("Trump Data:", trumpData.data);
        //window.alert("Payload recieved!")
      }
    } catch (error) {
      console.error("Error fetching EI analysis:", error);
      this.setState({ dataAvailable: false });
    }
  };
  

  renderChart = () => {
    if(!this.props.selectedTrend){
      return null;
    }
    if (!this.state.dataAvailable) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              border: "4px solid #f3f3f3" /* Light gray background */,
              borderTop: "4px solid #3498db" /* Blue color for the spinner */,
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite" /* Spinner animation */,
            }}
          ></div>
        </div>
      );
    }

    const economicSubSubTrends = [
      { id: "low", name: "0k-35k" },
      { id: "low_middle", name: "35K-120K" },
      { id: "upper_middle", name: "60K-120K" },
      { id: "upper", name: "125K+" },
    ];
    
    const getSubSubTrendName = (id) => {
      const subSubTrend = economicSubSubTrends.find((item) => item.id === id);
      return subSubTrend ? subSubTrend.name : id; // Return name or id if not found
    };
    

    if (this.props.selectedTrend === "Gingles") {
      if (!this.state.chartData || !this.state.chartData.dataPoints) {
        return <div>No data available</div>;
      }
      return (
        <ChartContainer
          type="scatter"
          data={this.state.chartData}
          height={600}
          width={1000}
          label=""
          selectedState={this.props.selectedState}
          selectedSubTrend={this.props.selectedSubTrend}
          selectedSubSubTrend={this.props.selectedSubSubTrend}
        />
      );
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    

    if (this.props.selectedTrend === "EI") {
      if (!this.state.chartData.bidenData || !this.state.chartData.trumpData) {
        return <div>No data available</div>;
      }
      console.log(this.state.chartData);
      return (

      <ChartContainer
          type="density"
          data={this.state.chartData} 
          height={200}
          width={900}
          label=""
        />
      );
    }

    if (this.props.selectedTrend === "MCMC") {
      console.log(this.state.chartData);
      if (!this.state.chartData && !this.props.selectedSubTrend && !this.state.selectedSubSubTrend) {
        return <div>No data available</div>;
      }
      console.log(this.state.chartData);


const title = `Generated and Enacted Plan Analysis for ${
  capitalizeFirstLetter(this.props.selectedSubTrend)
} ${
  this.props.selectedSubTrend === "economic"
    ? `(${getSubSubTrendName(this.props.selectedSubSubTrend)})`
    : this.props.selectedSubSubTrend
    ? `(${capitalizeFirstLetter(this.props.selectedSubSubTrend)})`
    : "Generated vs. Enacted Plan"
}`;

      return (

      <ChartContainer
          type="boxandwhisker"
          title={title}
          data={this.state.chartData} 
          height={640}
          width={1700}
          label=""
        />
      );
    }

    return null;
  };

  renderSideTable = () => {
    const { selectedTrend } = this.props;
    if (
      selectedTrend === "Gingles" ||
      selectedTrend === "MCMC" ||
      selectedTrend === "EI"
    )
      return null;
    return null;
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
          selectedSubSubTrend={this.props.selectedSubSubTrend}
          setSelectedSubSubTrend={this.props.setSelectedSubSubTrend}
          selectedSubSubSubTrend={this.props.selectedSubSubSubTrend}
          setSelectedSubSubSubTrend={this.props.setSelectedSubSubSubTrend}
        />
        
        {this.renderChart() !== null && (
  <div
    className="map-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div>{this.renderChart()}</div>
  </div>
)}


      </>
    );
  }
}

export default StateAnalysis;
