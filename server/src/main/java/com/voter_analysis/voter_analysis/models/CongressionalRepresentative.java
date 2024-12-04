package com.voter_analysis.voter_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "cd_representatives")
public class CongressionalRepresentative {

    @Id
    private String id; // MongoDB ID

    @Field("state_id")
    private int stateId;

    @Field("ID")
    private int districtId;

    @Field("representative")
    private String representative;

    @Field("race")
    private String race;

    @Field("party")
    private String party;
}
