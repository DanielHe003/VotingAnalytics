package com.voter_analysis.voter_analysis.sample_feature.mapper;

import com.voter_analysis.voter_analysis.sample_feature.dto.SampleFeatureDTO;
import com.voter_analysis.voter_analysis.sample_feature.model.SampleFeature;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SampleFeatureMapper {

    SampleFeatureDTO toDTO(SampleFeature samplefeature);
    SampleFeature toEntity(SampleFeatureDTO samplefeatureDTO);

}
