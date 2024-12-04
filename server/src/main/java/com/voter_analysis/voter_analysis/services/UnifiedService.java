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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;


@Service
public class UnifiedService {

    private final CongressionalDistrictRepository congressionalDistrictRepository;
    private final PrecinctRepository precinctRepository;
    private final StateRepository stateRepository;
    private final GinglesAnalysisRepository ginglesAnalysisRepository;
    private final StateMapper stateMapper;
    private final CongressionalDistrictMapper congressionalDistrictMapper;
    private final PrecinctMapper precinctMapper;
    private final GinglesMapper ginglesMapper;
    private final DemographicHeatMapService demographicService;
    private final EconomicHeatMapService economicService;
    private final RegionTypeHeatMapService regionTypeService;
    private final PovertyHeatMapService povertyService;
    private final PoliticalIncomeHeatMapService politicalIncomeService;
   

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
            PoliticalIncomeHeatMapService politicalIncomeService, 
            GinglesAnalysisRepository ginglesAnalysisRepository,
            GinglesMapper ginglesMapper) {
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
        this.ginglesMapper = ginglesMapper;
    }
    //Frequently accessed repo methods 
    @Cacheable(value = "precinctsByState", key = "#stateId")
    public List<Precinct> getPrecinctsByState(int stateId) {
        return precinctRepository.findByPropertiesStateId(stateId);
    }

    @Cacheable(value = "congressionalDistrictsByState", key = "#stateId")
    public List<CongressionalDistrict> getCongressionalDistrictsByState(int stateId) {
        return congressionalDistrictRepository.findByPropertiesStateId(stateId);
    }

    @Cacheable(value = "state", key = "#stateName")
    public State getStateByStateName(String stateName) {
        return stateRepository.findByPropertiesName(stateName);
    }
    @Cacheable(value = "paginatedPrecinctsByState", key = "#stateId + '-' + #page + '-' + #size")
    public Page<Precinct> getPaginatedPrecinctsByState(int stateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return precinctRepository.findByPropertiesStateId(stateId, pageable);
    }
    @Cacheable(value = "congressionalDistrictByStateAndDistrict", key = "#stateId + '-' + #cdId")
    public CongressionalDistrict getCongressionalDistrictByStateAndDistrict(int stateId, int cdId) {
        return congressionalDistrictRepository.findByPropertiesStateIdAndPropertiesDistrictId(stateId, cdId)
            .orElseThrow(() -> new IllegalArgumentException("District not found for stateId: " + stateId + ", cdId: " + cdId));
    }
    @Cacheable(value = "ginglesAnalysisByStateAndType", key = "#stateId + '-' + #analysisType")
    public List<GinglesAnalysis> getGinglesAnalysisByStateAndAnalysisType(int stateId, String analysisType) {
        return ginglesAnalysisRepository.findByStateIdAndAnalysisType(stateId, analysisType);
    }
    @Cacheable(value = "ginglesAnalysisByStateAndRegion", key = "#stateId + '-' + #regionType")
    public List<GinglesAnalysis> getGinglesAnalysisByStateAndRegion(int stateId, String regionType) {
        return ginglesAnalysisRepository.findByStateIdAndRegionType(stateId, regionType);
    }




    //Use case #1
    @Cacheable(value = "stateList")
    public List<StateListItem> getStateList() {
        return List.of(new StateListItem(1, "Alabama"), new StateListItem(6, "California"));
    }
    @Cacheable(value = "stateProperties", key = "#stateName")
    public StatePropertiesDTO getStateProperties(String stateName){
        State state = getStateByStateName(stateName);
        return stateMapper.toStatePropertiesDTO(state);
    }
    @Cacheable(value = "stateGeometry", key = "#stateName")
    public FeatureDTO getStateGeometry(String stateName) {
        State state = getStateByStateName(stateName);
        return stateMapper.toFeatureDTO(state);
    }
    //Use case #2
    @Cacheable(value = "congressionalDistrictsMaps", key = "#stateId")
    public FeatureCollectionDTO getCongressionalDistrictsMaps(int stateId) {
        List<CongressionalDistrict> districts = getCongressionalDistrictsByState(stateId);
        List<FeatureDTO> features = districts.stream()
                .map(congressionalDistrictMapper::toFeatureDTO)
                .collect(Collectors.toList());

        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
        return featureCollection;
    }
    //Use case #3
    @Cacheable(value = "stateSummary", key = "#stateName")
    public StateSummaryDTO getStateSummary(String stateName){
        State state = getStateByStateName(stateName);
        return stateMapper.toStateSummaryDTO(state);
    }
    //Use case 4-7
    @Cacheable(value = "precinctGeometries", key = "#stateId + '-' + #page + '-' + #size")
    public PaginatedFeatureCollectionDTO getPrecinctGeometries(int stateId, int page, int size) {
        System.out.println("State ID is " + stateId);
        Page<Precinct> precinctsPage = getPaginatedPrecinctsByState(stateId, page, size);
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
    @Cacheable(value = "demographicHeatMap", key = "#stateId + '-' + #demographicGroup")
    public DemographicHeatMapDTO getDemographicHeatMapData(int stateId, String demographicGroup) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
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
    @Cacheable(value = "economicHeatMap", key = "#stateId")
    public EconomicHeatMapDTO getEconomicHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
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
    @Cacheable(value = "regionTypeHeatMap", key = "#stateId")
    public RegionTypeHeatMapDTO getRegionTypeHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
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
    @Cacheable(value = "povertyHeatMap", key = "#stateId")
    public PovertyHeatMapDTO getPovertyHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
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
    @Cacheable(value = "politicalIncomeHeatMap", key = "#stateId")
    public PoliticalIncomeHeatMapDTO getPoliticalIncomeHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
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
    
    
    
    
    
    //Use Case #8
    @Cacheable(value = "districtRepresentationList", key = "#stateId")
    public List<CongressionalRepresentationDTO> getDistrictRepresentationList(int stateId) {
        // Fetch all districts for the given state
        List<CongressionalDistrict> districts = getCongressionalDistrictsByState(stateId);
    
        // Map districts to CongressionalRepresentationDTOs
        return districts.stream()
            .map(congressionalDistrictMapper::toRepresentationDTO)
            .collect(Collectors.toList());
    }
    //Use case #9
    @Cacheable(value = "districtMap", key = "#stateId + '-' + #cdId")
    public FeatureDTO getDistrictMap(int stateId, int cdId) {
        // Fetch the district for the given state and district ID
        CongressionalDistrict district = getCongressionalDistrictByStateAndDistrict(stateId, cdId);
    
        // Map the district to FeatureDTO containing only geometry
        FeatureDTO feature = congressionalDistrictMapper.toFeatureDTO(district);
    
        return feature;
    }
    
    

    

    //Use case #12
    @Cacheable(value = "raceGinglesData", key = "#stateId + '-' + #racialGroup")
    public ScatterPlotDTO<RaceGinglesDTO> getRaceGinglesData(int stateId, String racialGroup) {
        String demographic = RacialCategoryMapper.getDatabaseField(racialGroup);
        List<GinglesAnalysis> analyses = getGinglesAnalysisByStateAndAnalysisType(stateId, "regular");
        

        if (demographic == null) {
            throw new IllegalArgumentException("Invalid racial group: " + racialGroup);
        }

        List<RaceGinglesDTO> dataPoints = analyses.stream()
                .filter(analysis -> demographic.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
                .map(analysis -> ginglesMapper.toRaceGinglesDTO( analysis.getData()))
                .collect(Collectors.toList());

        return new ScatterPlotDTO<>(
            "Percentage of demographic group: " + racialGroup,
            "Party Vote Share (%)",
            "Party Vote Share vs. Percentage of demographic group: " + racialGroup,
            dataPoints
        );
                
    }
    
    // Use Case #13: Gingles Income Analysis
    @Cacheable(value = "incomeGinglesData", key = "#stateId + '-' + (#regionType != null ? #regionType : 'all')")
    public ScatterPlotDTO<IncomeGinglesDTO> getIncomeGinglesData(int stateId, String regionType) {
        List<GinglesAnalysis> analyses = regionType == null
                ? getGinglesAnalysisByStateAndAnalysisType(stateId, "income")
                : getGinglesAnalysisByStateAndRegion(stateId, regionType);

        List<IncomeGinglesDTO> dataPoints = analyses.stream()
                .map(analysis -> ginglesMapper.toIncomeGinglesDTO(analysis.getData(), regionType))
                .collect(Collectors.toList());

        return new ScatterPlotDTO<>(
                "Median Income ($)",
                "Party Vote Share (%)",
                "Party Vote Share vs. Median Income" + 
                (regionType != null ? " (" + regionType + ")" : ""),
                dataPoints
        );
    }
    
    //Use case #14
    @Cacheable(value = "incomeRaceGinglesData", key = "#stateId + '-' + #racialGroup")
    public ScatterPlotDTO<IncomeRaceGinglesDTO> getIncomeRaceGinglesData(int stateId, String racialGroup) {
        List<GinglesAnalysis> analyses = getGinglesAnalysisByStateAndAnalysisType(stateId, "income_race");
        System.out.println("analyses are + " + analyses);
        String databaseField = RacialCategoryMapper.getDatabaseField(racialGroup);

        if (databaseField == null) {
            throw new IllegalArgumentException("Invalid racial group: " + racialGroup);
        }

        List<IncomeRaceGinglesDTO> dataPoints = analyses.stream()
                .filter(analysis -> databaseField.equalsIgnoreCase((String) analysis.getData().get("Race_Column")))
                .map(analysis -> ginglesMapper.toIncomeRaceGinglesDTO( analysis.getData()))
                .collect(Collectors.toList());

        return new ScatterPlotDTO<>(
                "Combined income and demographic group " + racialGroup,
                "Party Vote Share (%)",
                "Party Vote Share vs. combined income and demographic group " + racialGroup,
                dataPoints
        );
    }
    
    //Use case #15
    @Cacheable(value = "ginglesTableData", key = "#stateId")
    public List<GinglesTableDTO> getGinglesTableData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
        return precincts.stream()
                .map(precinctMapper::toGinglesTableDTO)
                .collect(Collectors.toList());
    }
    
    

}
