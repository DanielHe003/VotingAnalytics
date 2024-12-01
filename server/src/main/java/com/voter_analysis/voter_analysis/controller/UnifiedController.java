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
    public ResponseEntity<FeatureDTO> getStateMap(@PathVariable String stateName) {
        FeatureDTO mapData = unifiedService.getStateGeometry(stateName);
        return ResponseEntity.ok(mapData);
    }

    //Use Case #2 
    @GetMapping("/states/{stateId}/districtmaps")
    public ResponseEntity<FeatureCollectionDTO> getDistrictPlan(@PathVariable int stateId) {
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
    public ResponseEntity<PaginatedFeatureCollectionDTO> getCombinedHeatMap(
            @PathVariable int stateId,
            @RequestParam int page,
            @RequestParam int size) {
        PaginatedFeatureCollectionDTO paginatedResponse = unifiedService.getCombinedPrecinctGeoJSON(stateId, page, size);
        return ResponseEntity.ok(paginatedResponse);
    }
    
    

    //Use Case #8-9
    @GetMapping("/states/{stateId}/districtTableMaps")
    public ResponseEntity<FeatureCollectionDTO> getDistrictTableMap(
            @PathVariable int stateId
            ) {
        FeatureCollectionDTO district = unifiedService.getDistrictTableMap(stateId);
        return ResponseEntity.ok(district);
    }
    //Use case #12
    @GetMapping("/states/{stateId}/gingles/race/{demographicGroup}")
    public ResponseEntity<List<RaceGinglesDTO>> getRaceGinglesData(
        @PathVariable int stateId,
        @PathVariable String demographicGroup){
            List<RaceGinglesDTO> raceGinglesData = unifiedService.getRaceGinglesData(stateId, demographicGroup);
            return ResponseEntity.ok(raceGinglesData);
    }
    //Use case #13
    @GetMapping("/states/{stateId}/gingles/income")
    public ResponseEntity<List<IncomeGinglesDTO>> getIncomeGinglesData(
            @PathVariable int stateId,
            @RequestParam(required = false) String regionType) {
        List<IncomeGinglesDTO> incomeGinglesData = unifiedService.getIncomeGinglesData(stateId, regionType);
        return ResponseEntity.ok(incomeGinglesData);
    }

    //Use Case #14
    @GetMapping("/states/{stateId}/gingles/income-race/{racialgroup}")
    public ResponseEntity<List<IncomeRaceGinglesDTO>> getIncomeRaceGinglesData(
            @PathVariable int stateId,
            @PathVariable String racialGroup) {
        List<IncomeRaceGinglesDTO> incomeRaceGinglesData = unifiedService.getIncomeRaceGinglesData(stateId, racialGroup);
        return ResponseEntity.ok(incomeRaceGinglesData);
    }

    //Use case #15
    @GetMapping("/states/{stateId}/gingles/table")
    public ResponseEntity<List<GinglesTableDTO>> getGinglesTableData(@PathVariable int stateId) {
        List<GinglesTableDTO> tableData = unifiedService.getGinglesTableData(stateId);
        return ResponseEntity.ok(tableData);
    }




}
