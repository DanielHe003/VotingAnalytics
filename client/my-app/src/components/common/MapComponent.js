import React, { Component, createRef } from "react";
import { MapContainer as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.initialPosition = [37.0902, -95.7129]; // Default position
    this.mapRef = createRef(); // Create a reference for the map
  }

  geoJsonStyle = (feature) => {
    return {
      color: "black",
      weight: 1,
      fillColor: "#005BA6",
      fillOpacity: 0.6,
    };
  };

  componentDidUpdate(prevProps) {
    // Check if geoJsonData has changed
    if (prevProps.geoJsonData !== this.props.geoJsonData && this.mapRef.current) {
      const geoJsonLayer = L.geoJSON(this.props.geoJsonData);
      const bounds = geoJsonLayer.getBounds();
      this.mapRef.current.fitBounds(bounds); // Fit the map to the bounds of the GeoJSON
    }
  }

  render() {
    const { geoJsonData } = this.props;

    return (
      <div style={{ display: "flex", flex: 1, height: "100%" }}>
        <LeafletMap
          center={this.initialPosition}
          zoom={4}
          style={{ flex: 1 }}
          ref={this.mapRef} // Attach the map reference
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoJsonData && <GeoJSON data={geoJsonData} style={this.geoJsonStyle} />}
        </LeafletMap>
      </div>
    );
  }
}

export default MapComponent;
