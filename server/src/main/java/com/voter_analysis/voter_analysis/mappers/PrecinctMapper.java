package com.voter_analysis.voter_analysis.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.voter_analysis.voter_analysis.models.Precinct;
import com.voter_analysis.voter_analysis.dtos.*;

@Mapper(componentModel = "spring")
public interface PrecinctMapper {

    // Map geometry and core fields
    @Mapping(source = "geometry", target = "geometry")
    @Mapping(source = "properties.stateId", target = "stateId")
    @Mapping(source = "properties.srPrecKey", target = "precinctKey")
    @Mapping(target = "demographicDataMap", ignore = true) // Will be set later
    @Mapping(target = "economicData", ignore = true)    // Will be set later
    @Mapping(target = "regionTypeData", ignore = true)  // Will be set later
    PrecinctHeatMapDTO toPrecinctHeatMapDTO(Precinct precinct);
    

}
