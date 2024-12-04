package com.voter_analysis.voter_analysis.services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.voter_analysis.voter_analysis.dtos.*;
import com.voter_analysis.voter_analysis.repositories.*;
import com.voter_analysis.voter_analysis.models.*;
import com.voter_analysis.voter_analysis.mappers.*;

@Service
public class UnifiedService {

    private final CongressionalDistrictRepository congressionalDistrictRepository;
    private final PrecinctRepository precinctRepository;
    private final StateRepository stateRepository;
    private final StateMapper stateMapper;
    private final CongressionalDistrictMapper congressionalDistrictMapper;
    private final PrecinctMapper precinctMapper;
    private final DemographicHeatMapService demographicService;
    private final EconomicHeatMapService economicService;
    private final RegionTypeHeatMapService regionTypeService;
    private final PovertyHeatMapService povertyService;
    private final PoliticalIncomeHeatMapService politicalIncomeService;
    private final GinglesAnalysisRepository ginglesAnalysisRepository;

    public UnifiedService(
            CongressionalDistrictRepository congressionalDistrictRepository,
            PrecinctRepository precinctRepository,
            StateRepository stateRepository, 
            StateMapper stateMapper, 
            CongressionalDistrictMapper congressionalDistrictMapper, 
            PrecinctMapper precinctMapper,
            DemographicHeatMapService demographicService,
            EconomicHeatMapService economicService,
            RegionTypeHeatMapService regionTypeService,
            PovertyHeatMapService povertyService,
            PoliticalIncomeHeatMapService politicalIncomeService, GinglesAnalysisRepository ginglesAnalysisRepository) {
        this.congressionalDistrictRepository = congressionalDistrictRepository;
        this.precinctRepository = precinctRepository;
        this.stateRepository = stateRepository;
        this.stateMapper = stateMapper;
        this.congressionalDistrictMapper = congressionalDistrictMapper;
        this.precinctMapper = precinctMapper;
        this.demographicService = demographicService;
        this.economicService = economicService;
        this.regionTypeService = regionTypeService;
        this.povertyService = povertyService;
        this.politicalIncomeService = politicalIncomeService;
        this.ginglesAnalysisRepository = ginglesAnalysisRepository;
    }
    //Use case #1
    public List<StateListItem> getStateList() {
        return List.of(new StateListItem(1, "Alabama"), new StateListItem(6, "California"));
    }
    public StatePropertiesDTO getStateProperties(String stateName){
        State state = stateRepository.findByPropertiesName(stateName);
        return stateMapper.toStatePropertiesDTO(state);
    }
    public FeatureDTO getStateGeometry(String stateName) {
        State state = stateRepository.findByPropertiesName(stateName);
        return stateMapper.toFeatureDTO(state);
    }
    //Use case #2
    public FeatureCollectionDTO getCongressionalDistrictsMaps(int stateId) {
        List<CongressionalDistrict> districts = congressionalDistrictRepository.findByPropertiesStateId(stateId);
        List<FeatureDTO> features = districts.stream()
                .map(congressionalDistrictMapper::toFeatureDTO)
                .collect(Collectors.toList());

        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
        return featureCollection;
    }
    //Use case #3
    public StateSummaryDTO getStateSummary(String stateName){
        State state = stateRepository.findByPropertiesName(stateName);
        return stateMapper.toStateSummaryDTO(state);
    }
    //Use case 4-7
    public PaginatedFeatureCollectionDTO getPrecinctGeometries(int stateId, int page, int size) {
        System.out.println("State ID is " + stateId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Precinct> precinctsPage = precinctRepository.findByPropertiesStateId(stateId, pageable);
        System.out.println("Number of precincts are " + precinctsPage.getNumberOfElements());
    
        List<FeatureDTO> features = precinctsPage.stream()
            .map(precinct -> {
                // Map to FeatureDTO with only geometry and minimal properties
                Map<String, Object> properties = new HashMap<>();
                properties.put("stateId", precinct.getProperties().getStateId());
                properties.put("precinctKey", precinct.getProperties().getSrPrecKey());
    
                FeatureDTO feature = new FeatureDTO();
                feature.setGeometry(precinctMapper.toGeometryDTO(precinct.getGeometry()));
                feature.setProperties(properties);
                return feature;
            })
            .collect(Collectors.toList());
    
        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
    
        // Create PaginatedFeatureCollectionDTO
        PaginatedFeatureCollectionDTO paginatedResponse = new PaginatedFeatureCollectionDTO();
        paginatedResponse.setPageNumber(precinctsPage.getNumber());
        paginatedResponse.setPageSize(precinctsPage.getSize());
        paginatedResponse.setTotalElements(precinctsPage.getTotalElements());
        paginatedResponse.setTotalPages(precinctsPage.getTotalPages());
        paginatedResponse.setFeatureCollection(featureCollection);
    
        return paginatedResponse;
    }
    //Use Case #4
    public DemographicHeatMapDTO getDemographicHeatMapData(int stateId, String demographicGroup) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
    
        List<DemographicHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                DemographicHeatDataDTO data = demographicService.calculateDemographicData(
                    precinct,
                    Arrays.asList(demographicGroup)
                ).get(demographicGroup);
    
                DemographicHeatDataDTO dto = new DemographicHeatDataDTO();
                dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
                dto.setPercentage(data.getPercentage());
                dto.setBin(data.getBin());
                dto.setColor(data.getColor());
                return dto;
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = demographicService.getLegend();
    
        DemographicHeatMapDTO response = new DemographicHeatMapDTO();
        response.setData(dataList);
        response.setLegend(legend);
        return response;
    }
    //Use case 5
    public EconomicHeatMapDTO getEconomicHeatMapData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
    
        List<EconomicHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                EconomicHeatDataDTO data = economicService.calculateEconomicData(precinct);
    
                EconomicHeatDataDTO dto = new EconomicHeatDataDTO();
                dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
                dto.setMedianIncome(data.getMedianIncome());
                dto.setBin(data.getBin());
                dto.setColor(data.getColor());
                return dto;
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = economicService.getLegend();
    
        EconomicHeatMapDTO response = new EconomicHeatMapDTO();
        response.setData(dataList);
        response.setLegend(legend);
        return response;
    }
    //Also use case 5
    public RegionTypeHeatMapDTO getRegionTypeHeatMapData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
    
        List<RegionTypeHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                RegionTypeHeatDataDTO data = regionTypeService.calculateRegionTypeData(precinct);
    
                RegionTypeHeatDataDTO dto = new RegionTypeHeatDataDTO();
                dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
                dto.setType(data.getType());
                dto.setColor(data.getColor());
                return dto;
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = regionTypeService.getLegend();
    
        RegionTypeHeatMapDTO response = new RegionTypeHeatMapDTO();
        response.setData(dataList);
        response.setLegend(legend);
        return response;
    }
    //Use case 6
    public PovertyHeatMapDTO getPovertyHeatMapData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
    
        List<PovertyHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                PovertyHeatDataDTO data = povertyService.calculatePovertyData(precinct);
    
                PovertyHeatDataDTO dto = new PovertyHeatDataDTO();
                dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
                dto.setPovertyPercentage(data.getPovertyPercentage());
                dto.setBin(data.getBin());
                dto.setColor(data.getColor());
                return dto;
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = povertyService.getLegend();
    
        PovertyHeatMapDTO response = new PovertyHeatMapDTO();
        response.setData(dataList);
        response.setLegend(legend);
        return response;
    }
    //Use case 7
    public PoliticalIncomeHeatMapDTO getPoliticalIncomeHeatMapData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
    
        List<PoliticalIncomeHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                PoliticalIncomeHeatDataDTO data = politicalIncomeService.calculatePoliticalIncomeData(precinct);
    
                PoliticalIncomeHeatDataDTO dto = new PoliticalIncomeHeatDataDTO();
                dto.setPrecinctKey(precinct.getProperties().getSrPrecKey());
                dto.setMedianIncome(data.getMedianIncome());
                dto.setBin(data.getBin());
                dto.setColor(data.getColor());
                dto.setDominantParty(data.getDominantParty());
                return dto;
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = politicalIncomeService.getLegend();
    
        PoliticalIncomeHeatMapDTO response = new PoliticalIncomeHeatMapDTO();
        response.setData(dataList);
        response.setLegend(legend);
        return response;
    }
    
    
    
    
    
    //Use Case #8-9
    public FeatureCollectionDTO getDistrictTableMap(int stateId) {
        // Fetch all districts for the given state
        List<CongressionalDistrict> districts = congressionalDistrictRepository.findByPropertiesStateId(stateId);
    
        // Map districts to FeatureDTOs
        List<FeatureDTO> features = districts.stream()
            .map(district -> {
                // Map to CongressionalRepresentationDTO
                CongressionalRepresentationDTO representationDTO = congressionalDistrictMapper.toRepresentationDTO(district);
    
                // Map to FeatureDTO
                return congressionalDistrictMapper.toFeatureDTO(district, representationDTO);
            })
            .collect(Collectors.toList());
    
        // Create FeatureCollectionDTO
        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
    
        return featureCollection;
    }

    //Use case #12
    public List<RaceGinglesDTO> getRaceGinglesData(int stateId, String racialGroup) {
        // Fetch GinglesAnalysis entries for the specified state and "regular" analysis type
        List<GinglesAnalysis> analyses = ginglesAnalysisRepository.findByStateIdAndAnalysisType(stateId, "regular");
        String databaseField = RacialCategoryMapper.getDatabaseField(racialGroup);
        if (databaseField == null) {
            throw new IllegalArgumentException("Invalid racial group: " + racialGroup);
        }
    
        
        long relevantPrecincts = analyses.stream()
        .filter(analysis -> databaseField.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
        .count();
        System.out.println("The number of precincts for the racial group " + racialGroup + " are: " + relevantPrecincts);
        return analyses.stream()
            .filter(analysis -> databaseField.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
            .map(analysis -> {
                double pctRace = Double.parseDouble((String) analysis.getData().get("PCT_RACE"));
                double pctDem = Double.parseDouble((String) analysis.getData().get("PCT_DEM"));
                double pctRep = Double.parseDouble((String) analysis.getData().get("PCT_REP"));
                String dominantParty = pctDem > pctRep ? "Blue" : "Red";
    
                RaceGinglesDTO dto = new RaceGinglesDTO();
                dto.setPrecinctKey(analysis.getPrecinctKey());
                dto.setRaceXAxis(pctRace);
                dto.setDeomcracticShareYAxis(pctDem);
                dto.setRepublicanShareYaxis(pctRep);
                dto.setDominantPartyColor(dominantParty);
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    
    //Use case #13
    public List<IncomeGinglesDTO> getIncomeGinglesData(int stateId, String regionType) {
        // Fetch GinglesAnalysis entries for the specified state and "income" analysis type
        List<GinglesAnalysis> analyses = regionType == null
            ? ginglesAnalysisRepository.findByStateIdAndAnalysisType(stateId, "income")
            : ginglesAnalysisRepository.findByStateIdAndRegionType(stateId, regionType);
        
        System.out.println("Number of precincts are "+ analyses.size());
        // Map to IncomeGinglesDTO
        return analyses.stream()
            .map(analysis -> {
                double medianIncome = Double.parseDouble((String) analysis.getData().get("MEDN_INC"));
                double pctDem = Double.parseDouble((String) analysis.getData().get("PCT_DEM"));
                double pctRep = Double.parseDouble((String) analysis.getData().get("PCT_REP"));
                String dominantParty = pctDem > pctRep ? "Blue" : "Red";
    
                IncomeGinglesDTO dto = new IncomeGinglesDTO();
                dto.setPrecinctKey(analysis.getPrecinctKey());
                dto.setMedianIncomeXaxis(medianIncome);
                dto.setDemocraticVoteShareYaxis(pctDem);
                dto.setRepublicanVoteShareYaxis(pctRep);
                dto.setDominantPartyColor(dominantParty);
                dto.setRegionType(analysis.getRegionType());
                return dto;
            })
            .collect(Collectors.toList());
    }
    //Use case #14
    public List<IncomeRaceGinglesDTO> getIncomeRaceGinglesData(int stateId, String racialGroup) {
        // Fetch GinglesAnalysis entries for the specified state and "income_race" analysis type
        List<GinglesAnalysis> incomeRaceAnalyses = ginglesAnalysisRepository.findByStateIdAndAnalysisType(stateId, "income_race");
        String databaseField = RacialCategoryMapper.getDatabaseField(racialGroup);
        if (databaseField == null) {
            throw new IllegalArgumentException("Invalid racial group: " + racialGroup);
        }
        
        
        long relevantPrecincts = incomeRaceAnalyses.stream()
        .filter(analysis -> databaseField.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
        .count();
        System.out.println("The number of precincts for the racial group " + racialGroup + " are: " + relevantPrecincts);
        // Filter data by the specified racial group
        return incomeRaceAnalyses.stream()
            .filter(analysis -> databaseField.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
            .map(analysis -> {
                double pctRaceIncome = Double.parseDouble((String) analysis.getData().get("PCT_RACE_INC"));
                double pctDem = Double.parseDouble((String) analysis.getData().get("PCT_DEM"));
                double pctRep = Double.parseDouble((String) analysis.getData().get("PCT_REP"));
    
                // Determine the dominant party based on vote percentages
                String dominantParty = pctDem > pctRep ? "Blue" : "Red";
    
                // Map to IncomeRaceGinglesDTO
                IncomeRaceGinglesDTO dto = new IncomeRaceGinglesDTO();
                dto.setPrecinctKey(analysis.getPrecinctKey());
                dto.setCompositeIndexXaxis(pctRaceIncome); 
                dto.setDemocraticVoteShareYaxis(pctDem);
                dto.setRepublicanVoteShareYaxis(pctRep); 
                dto.setDominantPartyColor(dominantParty); 
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    //Use case #15
    public List<GinglesTableDTO> getGinglesTableData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
        return precincts.stream()
                .map(precinctMapper::toGinglesTableDTO)
                .collect(Collectors.toList());
    }
    
    

}
