import React, { Component } from "react";
import { MapContainer as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.initialPosition = [37.0902, -95.7129];
  }

  geoJsonStyle = (feature) => {
    switch (feature.properties.name) {
      default:
        return { color: "black", weight: 1, fillColor: "#005BA6", fillOpacity: 0.6 };
    }
  };

  render() {
    const { geoJsonData } = this.props;

    return (
      <div style={{ display: "flex", flex: 1, height: "100%" }}>
        <LeafletMap center={this.initialPosition} zoom={4} style={{ flex: 1 }}>
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
