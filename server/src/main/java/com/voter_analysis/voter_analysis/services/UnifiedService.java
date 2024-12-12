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
    private final EIAnalysisRepository eiAnalysisRepository;
    private final CongressionalRepresentativeRepository congressionalRepresentativeRepository;
   

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
            GinglesMapper ginglesMapper,
            EIAnalysisRepository eiAnalysisRepository,
            CongressionalRepresentativeRepository congressionalRepresentativeRepository) {
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
        this.eiAnalysisRepository = eiAnalysisRepository;
        this.congressionalRepresentativeRepository = congressionalRepresentativeRepository;
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
        // Map stateName to stateId (ignoring case)
        int stateId;
        switch (stateName.toLowerCase()) {
            case "alabama":
                stateId = 1;
                break;
            case "cali":
            case "california":
                stateId = 6;
                break;
            default:
                throw new IllegalArgumentException("Invalid state name: " + stateName);
        }

        // Fetch state by ID and map to DTO
        State state = getStateByStateName(stateName); // Ensure this method uses stateId appropriately
        StateSummaryDTO dto = stateMapper.toStateSummaryDTO(state);

        // Fetch congressional representatives for this state
        List<CongressionalRepresentative> representatives = congressionalRepresentativeRepository.findByStateId(stateId);

        // Summarize representatives by party
        Map<String, Long> partySummary = representatives.stream()
            .collect(Collectors.groupingBy(CongressionalRepresentative::getParty, Collectors.counting()));

        // Add this summary to the DTO
        dto.setCongressionalPartySummary(partySummary);

        return dto;
    }
    //Use case 4-7 Retrieve paginated precinct geojson data
    @Cacheable(value = "precinctGeometries", key = "#stateId + '-' + #page + '-' + #size")
    public PaginatedFeatureCollectionDTO getPrecinctGeometries(int stateId, int page, int size) {
        
        // Fetch paginated precincts by state from the database
        Page<Precinct> precinctsPage = getPaginatedPrecinctsByState(stateId, page, size);
        
        // Map each precinct to a FeatureDTO
        List<FeatureDTO> features = precinctsPage.stream()
        .map(precinctMapper::mapToFeatureDTO)
        .collect(Collectors.toList());
        //From the features create a feature collection geojson front end is going to use
        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
    
        // Encapsulate geojson with relevant pagination metadata
        return new PaginatedFeatureCollectionDTO(
        precinctsPage.getNumber(),
        precinctsPage.getSize(),
        precinctsPage.getTotalElements(),
        precinctsPage.getTotalPages(),featureCollection);
        
    }
    //Use Case #4
    @Cacheable(value = "demographicHeatMap", key = "#stateId + '-' + #demographicGroup")
    public DemographicHeatMapDTO getDemographicHeatMapData(int stateId, String demographicGroup) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
        List<DemographicHeatDataDTO> dataList = precincts.stream()
            .map(precinct -> {
                return demographicService.calculateDemographicData(
                    precinct,
                    Arrays.asList(demographicGroup)
                ).get(demographicGroup);
            })
            .collect(Collectors.toList());
    
        Map<String, String> legend = demographicService.getLegend();
    
        return new DemographicHeatMapDTO(dataList, legend);
    }
    //Use case 5
    @Cacheable(value = "economicHeatMap", key = "#stateId")
    public EconomicHeatMapDTO getEconomicHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
        List<EconomicHeatDataDTO> dataList = precincts.stream()
            .map(economicService::calculateEconomicData)
            .collect(Collectors.toList());
    
        Map<String, String> legend = economicService.getLegend();
    
        return new EconomicHeatMapDTO(dataList, legend);
    }
    //Also use case 5
    @Cacheable(value = "regionTypeHeatMap", key = "#stateId")
    public RegionTypeHeatMapDTO getRegionTypeHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
        List<RegionTypeHeatDataDTO> dataList = precincts.stream()
        .map(regionTypeService::calculateRegionTypeData)
        .collect(Collectors.toList());
    
        Map<String, String> legend = regionTypeService.getLegend();
    
        return new RegionTypeHeatMapDTO(dataList, legend);
    }
    //Use case 6
    @Cacheable(value = "povertyHeatMap", key = "#stateId")
    public PovertyHeatMapDTO getPovertyHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
        List<PovertyHeatDataDTO> dataList = precincts.stream()
            .map(povertyService::calculatePovertyData)
            .collect(Collectors.toList());
    
        Map<String, String> legend = povertyService.getLegend();
    
        return new PovertyHeatMapDTO(dataList, legend);
    }
    //Use case 7
    @Cacheable(value = "politicalIncomeHeatMap", key = "#stateId")
    public PoliticalIncomeHeatMapDTO getPoliticalIncomeHeatMapData(int stateId) {
        List<Precinct> precincts = getPrecinctsByState(stateId);
    
        List<PoliticalIncomeHeatDataDTO> dataList = precincts.stream()
            .map(politicalIncomeService::calculatePoliticalIncomeData)
            .collect(Collectors.toList());
    
        Map<String, String> legend = politicalIncomeService.getLegend();
    
        return new PoliticalIncomeHeatMapDTO(dataList, legend);
    }
    
    
    
    
    
    //Use Case #8
    @Cacheable(value = "districtRepresentationList", key = "#stateId")
    public List<CongressionalRepresentationDTO> getDistrictRepresentationList(int stateId) {
        // Fetch all districts for the given state
        List<CongressionalDistrict> districts = getCongressionalDistrictsByState(stateId);
    
        // Convert districts to DTOs without representative info for now
        List<CongressionalRepresentationDTO> dtos = districts.stream()
            .map(congressionalDistrictMapper::toRepresentationDTO)
            .collect(Collectors.toList());
    
        // Fetch congressional representatives for this state
        List<CongressionalRepresentative> representatives = congressionalRepresentativeRepository.findByStateId(stateId);
    
        // Create a map of districtId -> CongressionalRepresentative
        Map<Integer, CongressionalRepresentative> repMap = representatives.stream()
            .collect(Collectors.toMap(CongressionalRepresentative::getDistrictId, rep -> rep));
    
        // Enrich each DTO with representative details if available
        for (CongressionalRepresentationDTO dto : dtos) {
            CongressionalRepresentative rep = repMap.get(dto.getDistrictId());
            if (rep != null) {
                dto.setRepresentative(rep.getRepresentative());
                dto.setParty(rep.getParty());
                dto.setRacialEthnicGroup(rep.getRace());
            } else {
                System.out.println("No representative data found for districtId: " + dto.getDistrictId());
            }
        }
    
        return dtos;
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
    //Use case #17 
    // Service method for Race Analysis
    @Cacheable(value = "raceAnalysis", key = "#stateId + '-' + #racialGroup + '-' + #candidateName")
    public List<EIAnalysisDTO> getRaceAnalysis(int stateId, String racialGroup, String candidateName) {
        System.out.println("Fetching race analysis for stateId: " + stateId + ", racialGroup: " + racialGroup + ", candidateName: " + candidateName);
    
        String databaseField = RacialCategoryMapper.getDatabaseField(racialGroup);
        if (databaseField == null) {
            System.out.println("Invalid racial group: " + racialGroup);
            throw new IllegalArgumentException("Invalid racial group: " + racialGroup);
        }
    
        System.out.println("Mapped racial group to database field: " + databaseField);
    
        // Fetch all EIAnalysis entries
        List<EIAnalysis> analyses = eiAnalysisRepository.findByStateIdAndAnalysisTypeAndCandidateNameAndRace(
            stateId, candidateName, databaseField
        );
        System.out.println("Number of analyses fetched: " + analyses.size());
    
        String nonField = "Non " + databaseField;
    
        // Process the fetched data
        List<EIAnalysisDTO> result = analyses.stream()
            .flatMap(analysis -> analysis.getData().stream()
                .filter(d -> {
                    boolean matches = d.getRace() != null && (d.getRace().equals(databaseField) || d.getRace().equals(nonField));
                    if (!matches) {
                        System.out.println("Data entry does not match racialGroup: " + d.getRace());
                    }
                    return matches;
                })
                .map(d -> {
                    System.out.println("Mapping data entry to DTO: " + d);
                    return EIAnalysisDTO.fromDataEntry(analysis, d);
                })
            )
            .collect(Collectors.toList());
    
        System.out.println("Number of results after processing: " + result.size());
        return result;
    }
    

    // Service method for Economic Analysis
    @Cacheable(value = "economicAnalysis", key = "#stateId + '-' + #economicGroup + '-' + #candidateName")
    public List<EIAnalysisDTO> getEconomicAnalysis(int stateId, String economicGroup, String candidateName) {
        System.out.println("Fetching economic analysis for stateId: " + stateId + ", economicGroup: " + economicGroup + ", candidateName: " + candidateName);

        // Map the user input to the corresponding database field
        String databaseField = EconomicCategoryMapper.getDatabaseField(economicGroup);
        if (databaseField == null) {
            System.out.println("Invalid economic group: " + economicGroup);
            throw new IllegalArgumentException("Invalid economic group: " + economicGroup);
        }

        System.out.println("Mapped economic group to database field: " + databaseField);

        // Fetch all EIAnalysis entries
        List<EIAnalysis> analyses = eiAnalysisRepository.findByStateIdAndAnalysisTypeAndCandidateNameAndGroupEconomic(
            stateId, candidateName, databaseField
        );
        System.out.println("Number of analyses fetched: " + analyses.size());

        String nonField = "Non " + databaseField;

        // Process the fetched data
        List<EIAnalysisDTO> result = analyses.stream()
            .flatMap(analysis -> analysis.getData().stream()
                .filter(d -> {
                    boolean matches = d.getGroup() != null && (d.getGroup().equals(databaseField) || d.getGroup().equals(nonField));
                    if (!matches) {
                        System.out.println("Data entry does not match economicGroup: " + d.getGroup());
                    }
                    return matches;
                })
                .map(d -> {
                    System.out.println("Mapping data entry to DTO: " + d);
                    return EIAnalysisDTO.fromDataEntry(analysis, d);
                })
            )
            .collect(Collectors.toList());

        System.out.println("Number of results after processing: " + result.size());
        return result;
    }
    

    // Service method for Region Analysis
    @Cacheable(value = "regionAnalysis", key = "#stateId + '-' + #regionGroup + '-' + #candidateName")
    public List<EIAnalysisDTO> getRegionAnalysis(int stateId, String regionGroup, String candidateName) {
        System.out.println("Fetching region analysis for stateId: " + stateId + ", regionGroup: " + regionGroup + ", candidateName: " + candidateName);
    
        List<EIAnalysis> analyses = eiAnalysisRepository.findByStateIdAndAnalysisTypeAndCandidateNameAndGroupRegion(
            stateId, candidateName, regionGroup
        );
        System.out.println("Number of analyses fetched: " + analyses.size());
    
        String nonField = "Non " + regionGroup;
    
        List<EIAnalysisDTO> result = analyses.stream()
            .flatMap(analysis -> analysis.getData().stream()
                .filter(d -> {
                    boolean matches = d.getGroup() != null && (d.getGroup().equals(regionGroup) || d.getGroup().equals(nonField));
                    if (!matches) {
                        System.out.println("Data entry does not match regionGroup: " + d.getGroup());
                    }
                    return matches;
                })
                .map(d -> {
                    System.out.println("Mapping data entry to DTO: " + d);
                    return EIAnalysisDTO.fromDataEntry(analysis, d);
                })
            )
            .collect(Collectors.toList());
    
        System.out.println("Number of results after processing: " + result.size());
        return result;
    }
    

    
    

}
