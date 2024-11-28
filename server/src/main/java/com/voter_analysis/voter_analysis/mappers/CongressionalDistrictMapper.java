package com.voter_analysis.voter_analysis.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.voter_analysis.voter_analysis.models.CongressionalDistrict;
import com.voter_analysis.voter_analysis.dtos.CongressionalDistrictMapDTO;

@Mapper(componentModel = "spring")
public interface CongressionalDistrictMapper {

    @Mapping(source = "properties.stateId", target = "stateId")
    @Mapping(source = "properties.districtId", target = "districtId")
    @Mapping(source = "geometry", target = "geometry")
    CongressionalDistrictMapDTO toMapDTO(CongressionalDistrict district);

    @Mapping(source = "type", target = "type")
    @Mapping(source = "coordinates", target = "coordinates")
    CongressionalDistrictMapDTO.GeometryDTO toGeometryDTO(CongressionalDistrict.Geometry geometry);
}
