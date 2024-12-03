import React, { createRef } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet"; 
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

  geoJsonStyle = (feature) => ({
    color: "black",
    weight: 1,
    fillColor: "#005BA6",
    fillOpacity: 0.6,
  });

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

    const properties = layer.feature.properties;
    const tooltipContent = Object.entries(properties)
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

  componentDidUpdate(prevProps) {
    if (prevProps.geoJsonData !== this.props.geoJsonData) {
      // console.log('Updated GeoJSON data:', this.props.geoJsonData);
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
      this.mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", flex: 1, height: "100%" }} ref={this.containerRef}>
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
        </div>
      </div>
    );
  }
}

export default MapComponent;