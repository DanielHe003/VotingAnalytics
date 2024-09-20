package com.voter_analysis.voter_analysis.sample_feature.service;

import com.voter_analysis.voter_analysis.sample_feature.model.SampleFeature;
import com.voter_analysis.voter_analysis.sample_feature.repository.SampleFeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleFeatureService {

    @Autowired
    private SampleFeatureRepository samplefeatureRepository;

    // Define your business logic here
}
