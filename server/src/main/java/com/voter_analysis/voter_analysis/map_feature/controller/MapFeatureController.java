package com.voter_analysis.voter_analysis.map_feature.controller;
import com.voter_analysis.voter_analysis.map_feature.service.MapFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/map")
public class MapFeatureController {

    @Autowired
    private MapFeatureService mapService;

    // Define your endpoints here
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMap() {
        Map<String, Object> mapData = mapService.getMap();
        return ResponseEntity.ok(mapData);
    }

    @GetMapping("/{state}")
    public ResponseEntity<Map<String, Object>> getStateMap(@PathVariable String state) {
        Map<String, Object> stateMapData = mapService.getStateMap(state);
        return  ResponseEntity.ok(stateMapData);
    }

}
