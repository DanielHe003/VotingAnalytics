package com.voter_analysis.voter_analysis.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.voter_analysis.voter_analysis.dtos.*;

import com.voter_analysis.voter_analysis.services.*;
import java.util.List;
@RestController
public class UnifiedController {

    private final UnifiedService unifiedService;

    public UnifiedController(UnifiedService unifiedService) {
        this.unifiedService = unifiedService;
    }
    @GetMapping("/")
    public String showServerStart() {
        return "Server is working"; 
    }
    // Use Case #1 
    // Retrieve the list of states
    @GetMapping("/states")
    public ResponseEntity<List<StateListItem>> getStates() {
        List<StateListItem> states = unifiedService.getStateList();
        return ResponseEntity.ok(states);
    }

    // Retrieve state properties
    @GetMapping("/states/{stateName}")
    public ResponseEntity<StatePropertiesDTO> getStateProperties(@PathVariable String stateName) {
        StatePropertiesDTO stateDetails = unifiedService.getStateProperties(stateName);
        System.out.println("state name is" + stateName);
        return ResponseEntity.ok(stateDetails);
    }

    // // Retrieve ensemble summary
    // @GetMapping("/states/{stateId}/ensembles")
    // public ResponseEntity<List<EnsembleSummary>> getEnsembles(@PathVariable String stateId) {
    //     List<EnsembleSummary> ensembles = unifiedService.getEnsembles(stateId);
    //     return ResponseEntity.ok(ensembles);
    // }

    //Retrieve state geometry
    @GetMapping("/states/{stateName}/map")
    public ResponseEntity<GeometryDTO> getStateMap(@PathVariable String stateName) {
        GeometryDTO mapData = unifiedService.getStateGeometry(stateName);
        return ResponseEntity.ok(mapData);
    }

    //Use Case #2 
    @GetMapping("/states/{stateId}/districtmaps")
    public ResponseEntity<List<CongressionalDistrictMapDTO>> getDistrictPlan(@PathVariable int stateId) {
        System.out.println("State id is "+ stateId);
        return ResponseEntity.ok(unifiedService.getCongressionalDistrictsMaps(stateId));
    }
    //Use Case #3 
    @GetMapping("/states/{stateName}/summary")
    public ResponseEntity<StateSummaryDTO> getStateSummary(@PathVariable String stateName) {
        StateSummaryDTO summary = unifiedService.getStateSummary(stateName);
        return ResponseEntity.ok(summary);
    }
    //Use Case #4-7
    @GetMapping("/states/{stateId}/precincts/combinedheatmap")
    public ResponseEntity<PaginatedResponse<PrecinctHeatMapDTO>> getCombinedHeatMap(
            @PathVariable int stateId,
            @RequestParam int page,
            @RequestParam int size) {
        PaginatedResponse<PrecinctHeatMapDTO> response = unifiedService.getCombinedPrecinctHeatMap(stateId, page, size);
        return ResponseEntity.ok(response);
    }
    

    //Use case #4
    // @GetMapping("/states/{stateId}/precincts/demographicHeatMap/{demographicGroup}")
    // public ResponseEntity<PaginatedResponse<PrecinctDemographicHeatMapDTO>> getDemographicHeatMap(
    //     @PathVariable int stateId, 
    //     @PathVariable String demographicGroup,
    //     @RequestParam int page, @RequestParam int size) { 
    //     PaginatedResponse<PrecinctDemographicHeatMapDTO> response = unifiedService.getPrecinctDemographicHeatMap(stateId, demographicGroup, page, size);
    //     return ResponseEntity.ok(response);
    // }
    

}
