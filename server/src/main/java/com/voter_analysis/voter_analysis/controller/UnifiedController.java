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
    // Use Case #4-7: Get precinct geometries
    @GetMapping("/states/{stateId}/precincts/geometries")
    public ResponseEntity<PaginatedFeatureCollectionDTO> getPrecinctGeometries(
            @PathVariable int stateId,
            @RequestParam int page,
            @RequestParam int size) {
        PaginatedFeatureCollectionDTO paginatedResponse = unifiedService.getPrecinctGeometries(stateId, page, size);
        return ResponseEntity.ok(paginatedResponse);
    }
    // Use Case #4: Get demographic heat map data
    @GetMapping("/states/{stateId}/heatmap/demographic/{demographicGroup}")
    public ResponseEntity<DemographicHeatMapDTO> getDemographicHeatMap(
            @PathVariable int stateId,
            @PathVariable String demographicGroup) {
        DemographicHeatMapDTO response = unifiedService.getDemographicHeatMapData(stateId, demographicGroup);
        return ResponseEntity.ok(response);
    }
    // Use Case #5: Get economic heat map data
    @GetMapping("/states/{stateId}/heatmap/economic")
    public ResponseEntity<EconomicHeatMapDTO> getEconomicHeatMap(
            @PathVariable int stateId) {
        EconomicHeatMapDTO response = unifiedService.getEconomicHeatMapData(stateId);
        return ResponseEntity.ok(response);
    }


    // Use Case #5 (Extension): Get region type heat map data
    @GetMapping("/states/{stateId}/heatmap/region-type")
    public ResponseEntity<RegionTypeHeatMapDTO> getRegionTypeHeatMap(
            @PathVariable int stateId) {
        RegionTypeHeatMapDTO response = unifiedService.getRegionTypeHeatMapData(stateId);
        return ResponseEntity.ok(response);
    }

   // Use Case #6: Get poverty level heat map data
   @GetMapping("/states/{stateId}/heatmap/poverty")
   public ResponseEntity<PovertyHeatMapDTO> getPovertyHeatMap(
           @PathVariable int stateId) {
       PovertyHeatMapDTO response = unifiedService.getPovertyHeatMapData(stateId);
       return ResponseEntity.ok(response);
   }

   // Use Case #7: Get political/income level heat map data
   @GetMapping("/states/{stateId}/heatmap/political-income")
   public ResponseEntity<PoliticalIncomeHeatMapDTO> getPoliticalIncomeHeatMap(
           @PathVariable int stateId) {
       PoliticalIncomeHeatMapDTO response = unifiedService.getPoliticalIncomeHeatMapData(stateId);
       return ResponseEntity.ok(response);
   }
    
    

    //Use Case #8
    @GetMapping("/states/{stateId}/districtRepresentation")
    public ResponseEntity<List<CongressionalRepresentationDTO>> getDistrictRepresentationList(
            @PathVariable int stateId) {
        List<CongressionalRepresentationDTO> representations = unifiedService.getDistrictRepresentationList(stateId);
        return ResponseEntity.ok(representations);
    }
    //Use Case #9
    @GetMapping("/states/{stateId}/districtMap/{cdId}")
    public ResponseEntity<FeatureDTO> getDistrictMap(
            @PathVariable int stateId,
            @PathVariable int cdId) {
        FeatureDTO districtMap = unifiedService.getDistrictMap(stateId, cdId);
        return ResponseEntity.ok(districtMap);
    }

    // Use case #11: List all available plans for a state
    @GetMapping("/{stateId}/districtPlans")
    public ResponseEntity<List<DistrictPlanDTO>> getAllDistrictPlans(
            @PathVariable int stateId) {
        List<DistrictPlanDTO> plans = unifiedService.getAllPlansForState(stateId);
        return ResponseEntity.ok(plans);
    }
    // GUI-11: Get the GeoJSON for a particular plan
    @GetMapping("/{stateId}/districtPlans/{planId}/geojson")
    public ResponseEntity<Object> getDistrictPlanGeojson(
            @PathVariable int stateId,
            @PathVariable String planId) {
        Object geojson = unifiedService.getPlanGeojson(stateId, planId);
        if (geojson == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(geojson);
    }
    @GetMapping("/{stateId}/districtPlans/num/{planNum}/geojson")
    public ResponseEntity<Object> getDistrictPlanGeojson(
            @PathVariable int stateId,
            @PathVariable int planNum) {
        Object geojson = unifiedService.getPlanGeojson(stateId, planNum);
        if (geojson == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(geojson);
    }

    //Use case #12
    @GetMapping("/states/{stateId}/gingles/race/{demographicGroup}")
    public ResponseEntity<ScatterPlotDTO<RaceGinglesDTO>> getRaceGinglesData(
        @PathVariable int stateId,
        @PathVariable String demographicGroup){
            ScatterPlotDTO<RaceGinglesDTO> raceGinglesData = unifiedService.getRaceGinglesData(stateId, demographicGroup);
            return ResponseEntity.ok(raceGinglesData);
    }
    //Use case #13
    @GetMapping("/states/{stateId}/gingles/income")
    public ResponseEntity<ScatterPlotDTO<IncomeGinglesDTO>> getIncomeGinglesData(
            @PathVariable int stateId,
            @RequestParam(required = false) String regionType) {
        ScatterPlotDTO<IncomeGinglesDTO> incomeGinglesData = unifiedService.getIncomeGinglesData(stateId, regionType);
        return ResponseEntity.ok(incomeGinglesData);
    }

    //Use Case #14
    @GetMapping("/states/{stateId}/gingles/income-race/{racialGroup}")
    public ResponseEntity<ScatterPlotDTO<IncomeRaceGinglesDTO>> getIncomeRaceGinglesData(
            @PathVariable int stateId,
            @PathVariable String racialGroup) {
        ScatterPlotDTO<IncomeRaceGinglesDTO> incomeRaceGinglesData = unifiedService.getIncomeRaceGinglesData(stateId, racialGroup);
        return ResponseEntity.ok(incomeRaceGinglesData);
    }

    //Use case #15
    @GetMapping("/states/{stateId}/gingles/table")
    public ResponseEntity<List<GinglesTableDTO>> getGinglesTableData(@PathVariable int stateId) {
        List<GinglesTableDTO> tableData = unifiedService.getGinglesTableData(stateId);
        return ResponseEntity.ok(tableData);
    }
    
    /**
     * Use Case #17: Candidate results for racial groups
     */
    @GetMapping("/{stateId}/ei-analysis/racial")
    public ResponseEntity<List<EIAnalysisDTO>> getRacialAnalysisResults(
            @PathVariable int stateId,
            @RequestParam String racialGroup,
            @RequestParam String candidateName,
            @RequestParam(required = false) String regionType) {
    
        List<EIAnalysisDTO> results = unifiedService.getRaceAnalysis(stateId, racialGroup, candidateName, regionType);
        return ResponseEntity.ok(results);
    }
    

    /**
     * Use Case #17: Candidate results for economic groups
     */
    @GetMapping("/{stateId}/ei-analysis/economic")
    public ResponseEntity<List<EIAnalysisDTO>> getEconomicAnalysisResults(
            @PathVariable int stateId,
            @RequestParam String economicGroup,
            @RequestParam String candidateName,
            @RequestParam(required = false) String regionType) {
    
        // regionType can be null if not provided
        List<EIAnalysisDTO> results = unifiedService.getEconomicAnalysis(stateId, economicGroup, candidateName, regionType);
        return ResponseEntity.ok(results);
    }

    

 // Use Case #17: Candidate results for region groups

    @GetMapping("/{stateId}/ei-analysis/region")
    public ResponseEntity<List<EIAnalysisDTO>> getRegionAnalysisResults(
            @PathVariable int stateId,
            @RequestParam String regionGroup,
            @RequestParam String candidateName,
            @RequestParam(required = false) String regionType) {

        List<EIAnalysisDTO> results = unifiedService.getRegionAnalysis(stateId, regionGroup, candidateName);
        return ResponseEntity.ok(results);
    }
    // GUI-23: Racial Box & Whisker
    @GetMapping("/{stateId}/boxwhisker/race")
    public ResponseEntity<List<BoxWhiskerDataDTO>> getRacialBoxWhisker(
            @PathVariable int stateId,
            @RequestParam String groupName) {
        List<BoxWhiskerDataDTO> results = unifiedService.getRacialBoxWhiskerData(stateId, groupName);
        return ResponseEntity.ok(results);
    }

    // GUI-25: Economic Box & Whisker
    @GetMapping("/{stateId}/boxwhisker/economic")
    public ResponseEntity<List<BoxWhiskerDataDTO>> getEconomicBoxWhisker(
            @PathVariable int stateId,
            @RequestParam String groupName) {
        
        List<BoxWhiskerDataDTO> results = unifiedService.getEconomicBoxWhiskerData(stateId, groupName);
        return ResponseEntity.ok(results);
    }

    // GUI-26: Region Box & Whisker (Optional)
    @GetMapping("/{stateId}/boxwhisker/region")
    public ResponseEntity<List<BoxWhiskerDataDTO>> getRegionBoxWhisker(
            @PathVariable int stateId,
            @RequestParam String groupName) {
        List<BoxWhiskerDataDTO> results = unifiedService.getRegionBoxWhiskerData(stateId, groupName);
        return ResponseEntity.ok(results);
    }
    
    //Use case #29
    // In UnifiedController class
    @GetMapping("/states/{stateId}/districts/{cdId}/summary")
    public ResponseEntity<DistrictSummaryDTO> getDistrictDataSummary(
            @PathVariable int stateId,
            @PathVariable int cdId) {
        DistrictSummaryDTO summary = unifiedService.getDistrictSummary(stateId, cdId);
        return ResponseEntity.ok(summary);
    }

    //Use case #30
    // In UnifiedController class
    @GetMapping("/states/{stateId}/precincts/{srPrecKey}/summary")
    public ResponseEntity<PrecinctSummaryDTO> getPrecinctDataSummary(
            @PathVariable int stateId,
            @PathVariable String srPrecKey) {
        PrecinctSummaryDTO summary = unifiedService.getPrecinctSummary(stateId, srPrecKey);
        return ResponseEntity.ok(summary);
    }

}
