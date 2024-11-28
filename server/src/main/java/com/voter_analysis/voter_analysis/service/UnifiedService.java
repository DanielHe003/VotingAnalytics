package com.voter_analysis.voter_analysis.service;
import org.springframework.stereotype.Service;
import java.util.List;

import com.voter_analysis.voter_analysis.dtos.*;
import com.voter_analysis.voter_analysis.repositories.*;
import com.voter_analysis.voter_analysis.models.*;
import org.springframework.stereotype.Service;
import com.voter_analysis.voter_analysis.mappers.*;
@Service
public class UnifiedService {

    private final CongressionalDistrictRepository congressionalDistrictRepository;
    private final PrecinctRepository precinctRepository;
    private final StateRepository stateRepository;
    private final StateMapper stateMapper;
    private final CongressionalDistrictMapper congressionalDistrictMapper;

    public UnifiedService(
            CongressionalDistrictRepository congressionalDistrictRepository,
            PrecinctRepository precinctRepository,
            StateRepository stateRepository, StateMapper stateMapper, CongressionalDistrictMapper congressionalDistrictMapper) {
        this.congressionalDistrictRepository = congressionalDistrictRepository;
        this.precinctRepository = precinctRepository;
        this.stateRepository = stateRepository;
        this.stateMapper = stateMapper;
        this.congressionalDistrictMapper = congressionalDistrictMapper;
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
}
