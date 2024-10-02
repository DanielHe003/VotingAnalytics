import React, { Component, createRef } from "react";
import { MapContainer as LeafletMap, TileLayer, GeoJSON, Tooltip } from "react-leaflet"; 
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import allStatesData from '../data/start.json'

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.initialPosition = [37.0902, -95.7129];
    this.mapRef = createRef();
    this.containerRef = createRef();
    this.state = {
      selectedFeature: null,
      geoJsonLayer: null,
      geoJsonData: props.geoJsonData || allStatesData, // Set default geoJsonData
    };
  }

  geoJsonStyle = (feature) => {
    return {
      color: "black",
      weight: 1,
      fillColor: "#005BA6",
      fillOpacity: 0.6,
    };
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
      fillColor: "#E6E6E6",
    });

    const properties = layer.feature.properties;

    const tooltipContent = Object.entries(properties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join("<br>");

    layer.bindTooltip(tooltipContent, { sticky: true }).openTooltip(); // Bind and open the tooltip
  };

  onFeatureMouseOut = (e) => {
    const layer = e.target;
    layer.setStyle(this.geoJsonStyle(layer.feature));
    layer.closeTooltip(); // Close the tooltip on mouse out
  };

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    if (this.containerRef.current) {
      this.resizeObserver.observe(this.containerRef.current);
    }
    this.updateGeoJsonLayer(this.state.geoJsonData); // Use state geoJsonData
  }

  componentDidUpdate(prevProps) {
    if (prevProps.geoJsonData !== this.props.geoJsonData) {
      this.setState({
        geoJsonData: this.props.geoJsonData || allStatesData, // Update state with new prop or default
      }, () => {
        this.updateGeoJsonLayer(this.state.geoJsonData); // Call update after state update
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
    if (!geoJsonData) return; // Ensure geoJsonData is valid
    console.log("Updating GeoJSON Layer with data:", geoJsonData);
    
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
  
      geoJsonLayer.addTo(this.mapRef.current); // Ensure the layer is added
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

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", flex: 1, height: "100%" }} ref={this.containerRef}>
          <LeafletMap
            center={this.initialPosition}
            zoom={4}
            style={{ flex: 1 }}
            ref={this.mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
          </LeafletMap>
        </div>
      </div>
    );
  }
}

export default MapComponent;
