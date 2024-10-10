package com.voter_analysis.voter_analysis.map_feature.controller;
import com.voter_analysis.voter_analysis.map_feature.service.MapFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/map")
@CrossOrigin(origins = "*")
public class MapFeatureController {

    @Autowired
    private MapFeatureService mapService;

    // Define your endpoints here
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMap() {
        Map<String, Object> mapData = mapService.getMap();
        return ResponseEntity.ok(mapData);
    }

    @GetMapping("/{state}/congressional-district")
    public ResponseEntity<Map<String, Object>> getDistrictMap(@PathVariable String state) {
        Map<String, Object> districtData = mapService.getDistrictMap(state);
        return ResponseEntity.ok(districtData);
    }
    @GetMapping("/{state}")
    public ResponseEntity<Map<String, Object>> getStateMap(@PathVariable String state) {
        Map<String, Object> stateMapData = mapService.getStateMap(state);
        return  ResponseEntity.ok(stateMapData);
    }

    @GetMapping("/{state}/precinct")
    public ResponseEntity<Map<String, Object>> getPrecinctMap(@PathVariable String state) {
        Map<String, Object> precinctData = mapService.getPrecinctMap(state);
        return ResponseEntity.ok(precinctData);
    }

    // @GetMapping("/{state}/congressional-district/{districtId}/data")
    // public ResponseEntity<Map<String, Object>> getDistrictData(
    //         @PathVariable String state, @PathVariable String districtId) {
    //     Map<String, Object> districtData = mapService.getDistrictData(state, districtId);
    //     return ResponseEntity.ok(districtData);
    // }

    @GetMapping("/{state}/precincts/data")
    public ResponseEntity<Map<String, Object>> getPrecinctsData(@PathVariable String state) {
        Map<String, Object> precinctData = mapService.getPrecinctsData(state);
        return ResponseEntity.ok(precinctData);
    }

}
