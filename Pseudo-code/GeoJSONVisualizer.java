import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.openstreetmap.gui.jmapviewer.JMapViewer;
import org.openstreetmap.gui.jmapviewer.MapMarkerDot;
import org.openstreetmap.gui.jmapviewer.MapPolygonImpl;

import javax.swing.*;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GeoJSONVisualizer {

    public static void visualizeGeoJSON(String geojsonFilePath) {

        // Step 1: Read the GeoJSON file, or if we get a csv file or anything else, we'll have to adjust it over
        List<Geometry> geometries = new ArrayList<>();
        GeometryJSON gjson = new GeometryJSON();
        try (FileReader reader = new FileReader(geojsonFilePath)) {
            Geometry geometry = gjson.read(reader);
            geometries.add(geometry);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        // Step 2: Initialize JMapViewer, a website/app that I found used most commonly for geospacial data in java
        JMapViewer mapViewer = new JMapViewer();
        
        // Step 3: Add geometries to the map, this is very brief and what I think we'll be doing
        for (Geometry geometry : geometries) {
            if (geometry instanceof Point) {
                Point point = (Point) geometry;
                mapViewer.addMapMarker(new MapMarkerDot(point.getY(), point.getX()));
            } else if (geometry instanceof Polygon) {
                Polygon polygon = (Polygon) geometry;
                List<Coordinate> coordinates = new ArrayList<>();
                for (Coordinate coord : polygon.getCoordinates()) {
                    coordinates.add(coord);
                }
                mapViewer.addMapPolygon(new MapPolygonImpl(coordinates));
            }
        }

        // Step 4: Display the map, have to do later which leads into the gui
        // Note: I'm thinking we use MCMC here before visualization to show the user what to do
        JFrame frame = new JFrame("GeoJSON Visualization");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().add(mapViewer);
        frame.setSize(800, 600);
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        // Coordinate how much load gets separated and from what sources
        visualizeGeoJSON("path_to_your_geojson_file.geojson");
    }
}
