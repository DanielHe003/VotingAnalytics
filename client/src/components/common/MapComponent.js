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

    if (!heatMapLegend || Object.keys(heatMapLegend).length === 0) {
      return null;
    }

    return (
      <div className="legend">
        {selectedTrend === "precinct" && (
          <>
            <h4>Legend</h4>
            <ul>
              {Object.entries(heatMapLegend).map(([range, color], index) => (
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
};

  render() {
    return (
      <div className="map-container">
        {this.props.title && <h3>{this.props.title}</h3>}
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
