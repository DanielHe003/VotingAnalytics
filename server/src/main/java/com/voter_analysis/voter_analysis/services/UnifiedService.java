package com.voter_analysis.voter_analysis.services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import java.util.Arrays;
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
    public GeometryDTO getStateGeometry(String stateName){
        State state = stateRepository.findByPropertiesName(stateName);
        return stateMapper.toStateGeometryDTO(state);
    }
    //Use case #2
    public List<CongressionalDistrictMapDTO> getCongressionalDistrictsMaps(int stateId){
        List<CongressionalDistrict> congressionalDistricts = congressionalDistrictRepository.findByPropertiesStateId(stateId);
        return congressionalDistricts.stream()
        .map(congressionalDistrictMapper::toMapDTO)
        .toList();
    }
    //Use case #3
    public StateSummaryDTO getStateSummary(String stateName){
        State state = stateRepository.findByPropertiesName(stateName);
        return stateMapper.toStateSummaryDTO(state);
    }
    //Use case #4-7
    public PaginatedResponse<PrecinctHeatMapDTO> getCombinedPrecinctHeatMap(int stateId, int page, int size) {
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

        List<PrecinctHeatMapDTO> combinedData = precinctsPage.stream()
            .map(precinct -> {
                PrecinctHeatMapDTO dto = precinctMapper.toPrecinctHeatMapDTO(precinct);

                // Calculate and set demographic data
                Map<String, DemographicHeatData> demographicDataMap = demographicService.calculateDemographicData(precinct, demographicGroups);
                dto.setDemographicDataMap(demographicDataMap);

                // Calculate and set economic data
                EconomicHeatData economicData = economicService.calculateEconomicData(precinct);
                dto.setEconomicData(economicData);

                // Calculate and set region type data
                RegionTypeHeatData regionTypeData = regionTypeService.calculateRegionTypeData(precinct);
                dto.setRegionTypeData(regionTypeData);

                // Calculate and set poverty data
                PovertyHeatData povertyData = povertyService.calculatePovertyData(precinct);
                dto.setPovertyData(povertyData);

                // Calculate and set political income data
                PoliticalIncomeHeatData politicalIncomeData = politicalIncomeService.calculatePoliticalIncomeData(precinct);
                dto.setPoliticalIncomeData(politicalIncomeData);

                return dto;
            })
            .collect(Collectors.toList());

        // Legends
        Map<String, Map<String, String>> legends = new HashMap<>();
        legends.put("demographicLegend", demographicService.getLegend());
        legends.put("economicLegend", economicService.getLegend());
        legends.put("regionTypeLegend", regionTypeService.getLegend());
        legends.put("povertyLegend", povertyService.getLegend());
        legends.put("politicalIncomeLegend", politicalIncomeService.getLegend());

        return new PaginatedResponse<>(
            combinedData,
            precinctsPage.getNumber(),
            precinctsPage.getSize(),
            precinctsPage.getTotalElements(),
            precinctsPage.getTotalPages(),
            legends
        );
    }

}
