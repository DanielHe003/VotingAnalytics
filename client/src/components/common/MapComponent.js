import React, { createRef } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css";

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.initialPosition = [37.0902, -95.7129];
    this.mapRef = createRef();
    this.containerRef = createRef();
    this.state = {
      selectedFeature: null,
      geoJsonLayer: null,
      geoJsonData: props.geoJsonData,
    };
  }

  geoJsonStyle = (feature) => {
    const fillColor = feature.properties.color || "#005BA6";
    return {
      color: "black",
      weight: 1,
      fillColor,
      fillOpacity: 0.6,
    };
  };

  modifyProperties = (properties) => {
    const modifiedProperties = new Map();
    for (const [key, value] of Object.entries(properties)) {
      switch (key) {
        case "precinctKey":
          modifiedProperties.set("Precinct ID", value);
          break;
        case "stateId":
          modifiedProperties.set("State", value === 1 ? "Alabama" : value === 6 ? "California" : value);
          break;
        case "percentage":
          modifiedProperties.set("Percentage (%)", value.toFixed(2)); 
          break;
        case "povertyPercentage":
          modifiedProperties.set("Poverty Percentage (%)", value.toFixed(2)); 
          break;
        case "type":
          modifiedProperties.set("Region Type", value);
          break;
        case "medianIncome":
          modifiedProperties.set("Median Income ($)", value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
          break;
        case "districtId":
          modifiedProperties.set("District ID", value);
          break;
        case "bin":
          break;
        case "color":
          break;
        default:
          modifiedProperties.set(key, value);
      }
    }
    return modifiedProperties;
  };
  

  onFeatureClick = (e) => {
    const { properties } = e.target.feature;
    if (this.props.onFeatureClick) {
      this.props.onFeatureClick(properties.name);
    }
    this.setState({
      selectedFeature: properties,
    });
  };

  onFeatureMouseOver = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: "white",
      color: "#005BA6",
      weight: 2.5,
    });

    const modifiedProperties = this.modifyProperties(layer.feature.properties);

    const tooltipContent = Array.from(modifiedProperties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join("<br>");

    layer.bindTooltip(tooltipContent, { sticky: true }).openTooltip();
  };

  onFeatureMouseOut = (e) => {
    const layer = e.target;
    layer.setStyle(this.geoJsonStyle(layer.feature));
    layer.closeTooltip();
  };

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    if (this.containerRef.current) {
      this.resizeObserver.observe(this.containerRef.current);
    }
    this.updateGeoJsonLayer(this.state.geoJsonData);
  }

  componentDidUpdate(prevProps, prevState) {  
    if(this.props.selectedTrend === "precinct"){
      this.renderLegend()
    }
    if (prevProps.geoJsonData !== this.props.geoJsonData) {
      this.setState({ geoJsonData: this.props.geoJsonData }, () => {
        this.updateGeoJsonLayer(this.state.geoJsonData);
      });
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver && this.containerRef.current) {
      this.resizeObserver.unobserve(this.containerRef.current);
    }
    if (this.state.geoJsonLayer) {
      this.mapRef.current.removeLayer(this.state.geoJsonLayer);
    }
  }

  handleResize = () => {
    if (this.mapRef.current) {
      this.mapRef.current.invalidateSize();
    }
  };

  updateGeoJsonLayer = (geoJsonData) => {
    if (!geoJsonData) return;

    if (this.mapRef.current) {
      if (this.state.geoJsonLayer) {
        this.mapRef.current.removeLayer(this.state.geoJsonLayer);
      }

      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: this.geoJsonStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            click: this.onFeatureClick,
            mouseover: this.onFeatureMouseOver,
            mouseout: this.onFeatureMouseOut,
          });
        },
      });

      geoJsonLayer.addTo(this.mapRef.current);
      this.setState({ geoJsonLayer });
      this.fitMapToGeoJsonData(geoJsonLayer);
    }
  };

  fitMapToGeoJsonData = (geoJsonLayer) => {
    if (geoJsonLayer) {
      const bounds = geoJsonLayer.getBounds();
      this.mapRef.current.fitBounds(bounds);
    }
  };

  renderLegend = () => {
    const { heatMapLegend, selectedTrend } = this.props;
    // console.log(heatMapLegend);
  
    if (!heatMapLegend || Object.keys(heatMapLegend).length === 0) {
      return null;
    }

    function convertRanges(ranges) {
      // Check if at least one key contains ",000"
      const hasThousands = Object.keys(ranges).some(range => range.includes(',000'));
    
      // If no key contains ",000", return the original ranges
      if (!hasThousands) {
        return ranges;
      }
      
      const convertedRanges = {};
    
      Object.keys(ranges).forEach(range => {
        const [lower, upper] = range.split(' - ').map(val => parseInt(val.replace(/[$,]/g, ''), 10));
        const lowerRange = Math.floor(lower / 25000) * 25; // Round down to the nearest 25K
        const upperRange = Math.floor(upper / 25000) * 25; // Round down to the nearest 25K
        
        const newKey = upperRange ? `${lowerRange}K - ${upperRange}K` : `${lowerRange}K+`;
    
        convertedRanges[newKey] = ranges[range]; // Keep the corresponding data
      });
    
      return convertedRanges;
    }
    
if (Object.entries(heatMapLegend).some(([range]) => range.includes("Democrat") || range.includes("Republican"))) {

  const resultDict = {};

  // Iterate through each key in the data
  Object.keys(heatMapLegend).forEach(key => {
    // Extract the range and party (Democrat/Republican)
    const [range, party] = key.split(" (");
    const partyName = party.slice(0, -1);  // Remove the closing parenthesis
    
    // If the range doesn't exist in the dictionary, create an empty object for it
    if (!resultDict[range]) {
      resultDict[range] = { Dcolor: "", Rcolor: "" };
    }
    
    // Assign the color based on the party
    if (partyName === "Democrat") {
      resultDict[range].Dcolor = heatMapLegend[key];
    } else if (partyName === "Republican") {
      resultDict[range].Rcolor = heatMapLegend[key];
    }
  });

  console.log(resultDict);

  
  
  const converted = convertRanges(resultDict);

  return (
    <div className="legend">
      {selectedTrend === "precinct" && (
        <>
          <h4>Legend</h4>
          <table>
            <thead>
              <tr>
                <th><center>D</center></th>
                <th><center>R</center></th>
                <th><center>Range</center></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(converted).map(([range, colors], index) => (
                <tr key={index}>
                  <td>
                    <span
                      className="color-box"
                      style={{ backgroundColor: colors.Dcolor }}
                    ></span>
                  </td>
                  <td>
                    <span
                      className="color-box"
                      style={{ backgroundColor: colors.Rcolor }}
                    ></span>
                  </td>
                  <td>{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
  

}
else {
    const rangeConvert = convertRanges(heatMapLegend);
      return (
        <div className="legend">
          {selectedTrend === "precinct" && (
            <>
              <h4>Legend</h4>
              <ul>
                {Object.entries(rangeConvert)
                  .filter(([range]) => !(range.includes("Democrat") || range.includes("Republican")))
                  .map(([range, color], index) => (
                    <li key={index}>
                      <span className="color-box" style={{ backgroundColor: color }}></span>
                      {range}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      );
    }
  };    

  render() {
    const availablePlans = [
      {
        name: "Alabama",
        options: [
          { id: "enacted", name: "Current Plan" },
          { id: "maxIncomeDeviation1", name: "Max Income Deviation 1" },
          { id: "maxIncomeDeviation2", name: "Max Income Deviation 2" },
          { id: "minIncomeDeviation1", name: "Min Income Deviation 1" },
          { id: "minIncomeDeviation2", name: "Min Income Deviation 2" },
          { id: "heavilyRural1", name: "Heavily Rural 1" },
          { id: "heavilyRural2", name: "Heavily Rural 2" },
          { id: "heavilyRural3", name: "Heavily Rural 3" }
        ]
      },
      {
        name: "California",
        options: [
          { id: "enacted", name: "Current Plan" },
          { id: "maxIncomeDeviation1", name: "Max Income Deviation 1" },
          { id: "maxIncomeDeviation2", name: "Max Income Deviation 2" },
          { id: "minIncomeDeviation1", name: "Min Income Deviation 1" },
          { id: "minIncomeDeviation2", name: "Min Income Deviation 2" },
          { id: "heavilyRural1", name: "Heavily Rural 1" },
          { id: "heavilyRural2", name: "Heavily Rural 2" },
          { id: "heavilyRural3", name: "Heavily Rural 3" },
          { id: "heavilyRural4", name: "Heavily Rural 4" },
          { id: "heavilyUrban1", name: "Heavily Urban 1" },
          { id: "heavilyUrban2", name: "Heavily Urban 2" },
          { id: "heavilyUrban3", name: "Heavily Urban 3" },
          { id: "heavilyUrban4", name: "Heavily Urban 4" },
          { id: "heavilySuburban1", name: "Heavily Suburban 1" },
          { id: "heavilySuburban2", name: "Heavily Suburban 2" },
          { id: "heavilySuburban3", name: "Heavily Suburban 3" },
          { id: "heavilySuburban4", name: "Heavily Suburban 4" }
        ]
      }
    ];  
    // console.log(availablePlans[this.props.selectedState]);

    const selectedPlan = availablePlans.find(
      (plan) => plan.name === this.props.selectedState
    );
  
    const title = selectedPlan?.options.find(
      (option) => option.id === this.props.title
    )?.name;

    return (
      <div className="map-container">
      {title && <h3>{title}</h3>}
    
        <div className="map-wrapper" ref={this.containerRef}>
          <LeafletMap
            center={this.initialPosition}
            zoom={3}
            style={{ flex: 1 }}
            ref={this.mapRef}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
          </LeafletMap>
          {this.renderLegend()}
        </div>
      </div>
    );
  }
}

export default MapComponent;
