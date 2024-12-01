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
            PoliticalIncomeHeatMapService politicalIncomeService) {
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
    //Use case #4-7
    public PaginatedFeatureCollectionDTO getCombinedPrecinctGeoJSON(int stateId, int page, int size) {
        System.out.println("State ID is " + stateId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Precinct> precinctsPage = precinctRepository.findByPropertiesStateId(stateId, pageable);
        System.out.println("Number of precincts are " + precinctsPage.getNumberOfElements());
    
        // List of all demographic groups
        List<String> demographicGroups = Arrays.asList(
            "white",
            "black",
            "hispanic",
            "asian",
            "american_indian_alaska_native",
            "native_hawaiian_pacific_islander",
            "multiracial",
            "other"
        );
    
        List<FeatureDTO> features = precinctsPage.stream()
            .map(precinct -> {
                // Calculate and set demographic data
                Map<String, DemographicHeatData> demographicDataMap = demographicService.calculateDemographicData(precinct, demographicGroups);
    
                // Calculate and set economic data
                EconomicHeatData economicData = economicService.calculateEconomicData(precinct);
    
                // Calculate and set region type data
                RegionTypeHeatData regionTypeData = regionTypeService.calculateRegionTypeData(precinct);
    
                // Calculate and set poverty data
                PovertyHeatData povertyData = povertyService.calculatePovertyData(precinct);
    
                // Calculate and set political income data
                PoliticalIncomeHeatData politicalIncomeData = politicalIncomeService.calculatePoliticalIncomeData(precinct);
    
                // Map to FeatureDTO
                FeatureDTO feature = precinctMapper.toFeatureDTO(
                    precinct,
                    demographicDataMap,
                    economicData,
                    regionTypeData,
                    povertyData,
                    politicalIncomeData
                );
    
                return feature;
            })
            .collect(Collectors.toList());
    
        FeatureCollectionDTO featureCollection = new FeatureCollectionDTO();
        featureCollection.setFeatures(features);
    
        // Legends
        Map<String, Map<String, String>> legends = new HashMap<>();
        legends.put("demographicLegend", demographicService.getLegend());
        legends.put("economicLegend", economicService.getLegend());
        legends.put("regionTypeLegend", regionTypeService.getLegend());
        legends.put("povertyLegend", povertyService.getLegend());
        legends.put("politicalIncomeLegend", politicalIncomeService.getLegend());
    
        // Create PaginatedFeatureCollectionDTO
        PaginatedFeatureCollectionDTO paginatedResponse = new PaginatedFeatureCollectionDTO();
        paginatedResponse.setPageNumber(precinctsPage.getNumber());
        paginatedResponse.setPageSize(precinctsPage.getSize());
        paginatedResponse.setTotalElements(precinctsPage.getTotalElements());
        paginatedResponse.setTotalPages(precinctsPage.getTotalPages());
        paginatedResponse.setFeatureCollection(featureCollection);
        paginatedResponse.setLegends(legends);
    
        return paginatedResponse;
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
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
        return precincts.stream()
                .map(precinct -> precinctMapper.toRaceGinglesDTO(
                        precinct,
                        getRacialPercentage(precinct, racialGroup)))
                .collect(Collectors.toList());
    }
    
    //Use case #13
    public List<IncomeGinglesDTO> getIncomeGinglesData(int stateId, String regionType) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
        
        // Filter by region type if provided
        if (regionType != null) {
            precincts = precincts.stream()
                .filter(p -> regionType.equalsIgnoreCase(p.getProperties().getCategory()))
                .collect(Collectors.toList());
        }
    
        // Warn if median income is 0 and skip those entries
        precincts.stream()
            .filter(p -> p.getProperties().getMednInc21() == 0)
            .forEach(p -> System.out.println("Warning: Precinct " + p.getProperties().getSrPrecKey() + " has income 0"));
    
        // Map to DTO
        return precincts.stream()
            .filter(p -> p.getProperties().getMednInc21() > 0) // Skip invalid income data
            .map(precinctMapper::toIncomeGinglesDTO)
            .collect(Collectors.toList());
    }
    
    
    
    //Use case #14
    public List<IncomeRaceGinglesDTO> getIncomeRaceGinglesData(int stateId, String racialGroup) {
        // Fetch precincts for the state
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
        
        // Calculate min and max values for normalization
        double minIncome = precincts.stream()
            .mapToDouble(p -> p.getProperties().getMednInc21())
            .min().orElse(0);
        double maxIncome = precincts.stream()
            .mapToDouble(p -> p.getProperties().getMednInc21())
            .max().orElse(1);
        double minRacePct = precincts.stream()
            .mapToDouble(p -> getRacialPercentage(p, racialGroup))
            .min().orElse(0);
        double maxRacePct = precincts.stream()
            .mapToDouble(p -> getRacialPercentage(p, racialGroup))
            .max().orElse(1);
        
        // Map precincts to DTOs
        return precincts.stream()
            .map(p -> precinctMapper.toIncomeRaceGinglesDTO(
                p,
                getRacialPercentage(p, racialGroup),
                minIncome,
                maxIncome,
                minRacePct,
                maxRacePct
            ))
            .collect(Collectors.toList());
    }
    
    // Helper method to get racial percentage
    private double getRacialPercentage(Precinct precinct, String racialGroup) {
        Map<String, Double> racialPercentages = calculateRacialPercentages(precinct);
        return racialPercentages.getOrDefault(racialGroup.toLowerCase(), 0.0);
    }
    private Map<String, Double> calculateRacialPercentages(Precinct precinct) {
        Precinct.Properties props = precinct.getProperties();
        double totalPopulation = props.getTotPop();

        // Avoid division by zero
        if (totalPopulation == 0) {
            return Collections.emptyMap();
        }

        Map<String, Double> racialPercentages = new HashMap<>();
        racialPercentages.put("white", (props.getPopWht() / totalPopulation) * 100.0);
        racialPercentages.put("black", (props.getPopBlk() / totalPopulation) * 100.0);
        racialPercentages.put("hispanic", (props.getPopHisLat() / totalPopulation) * 100.0);
        racialPercentages.put("asian", (props.getPopAsn() / totalPopulation) * 100.0);
        racialPercentages.put("american_indian_alaska_native", (props.getPopAindalk() / totalPopulation) * 100.0);
        racialPercentages.put("native_hawaiian_pacific_islander", (props.getPopHipi() / totalPopulation) * 100.0);
        racialPercentages.put("multiracial", (props.getPopTwoMor() / totalPopulation) * 100.0);
        racialPercentages.put("other", (props.getPopOth() / totalPopulation) * 100.0);

        return racialPercentages;
    }
    //Use case #15
    public List<GinglesTableDTO> getGinglesTableData(int stateId) {
        List<Precinct> precincts = precinctRepository.findByPropertiesStateId(stateId);
        return precincts.stream()
                .map(precinctMapper::toGinglesTableDTO)
                .collect(Collectors.toList());
    }
    
    

}
