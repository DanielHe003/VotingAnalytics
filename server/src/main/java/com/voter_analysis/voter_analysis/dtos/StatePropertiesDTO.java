package com.voter_analysis.voter_analysis.dtos;

import lombok.Data;

@Data
public class StatePropertiesDTO {
    private String name;
    private double pctDem;
    private double pctRep;
    private int prsDem01;
    private int prsRep01;
    private int totVotes;
    private double totPop;
    private double popHisLat;
    private double popWht;
    private double popBlk;
    private double popAindalk;
    private double popAsn;
    private double popHipi;
    private double popOth;
    private double popTwoMor;
    private double totHous21;
    private double less10K21;
    private double k10To15K21;
    private double k15To20K21;
    private double k20To25K21;
    private double k25To30K21;
    private double k30To35K21;
    private double k35To40K21;
    private double k40To45K21;
    private double k45To50K21;
    private double k50To60K21;
    private double k60To75K21;
    private double k75To100K21;
    private double k100To125K21;
    private double k125To150K21;
    private double k150To200K21;
    private double k200KMor21;
    private double mednInc21;
    private double areaLand;
    private double urban;
    private double rural;
    private double suburban;
    private double density;
    private String category;
    private double poverty;
    private double povertyPct;

    // Getters and Setters
    // Add constructors, getters, and setters for all fields as needed
}
