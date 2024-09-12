package com.voter_analysis.voter_analysis.sample_feature.controller;

import com.voter_analysis.voter_analysis.sample_feature.service.SampleFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/samplefeature")
public class SampleFeatureController {

    @Autowired
    private SampleFeatureService samplefeatureService;

    // Define your endpoints here
}
