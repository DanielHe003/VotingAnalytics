package com.voter_analysis.voter_analysis.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import com.voter_analysis.voter_analysis.models.State;
import com.voter_analysis.voter_analysis.dtos.*;
import java.util.HashMap;
import java.util.Map;



@Mapper(componentModel = "spring")
public interface StateMapper {
    StateMapper INSTANCE = Mappers.getMapper(StateMapper.class);

    // Map only the 'properties' field of State to StatePropertiesDTO
    @Mapping(source = "properties", target = ".") // Map the properties field directly
    StatePropertiesDTO toStatePropertiesDTO(State state);

    @Mapping(source = "geometry.type", target = "type")
    @Mapping(source = "geometry.coordinates", target = "coordinates")
    GeometryDTO toStateGeometryDTO(State state);

    @Mapping(source = "properties.name", target = "name")
    @Mapping(source = "properties.totPop", target = "totalPopulation")
    @Mapping(source = "properties.pctDem", target = "pctDem")
    @Mapping(source = "properties.pctRep", target = "pctRep")
    @Mapping(source = "properties.prsDem01", target = "prsDem01")
    @Mapping(source = "properties.prsRep01", target = "prsRep01")
    @Mapping(source = "properties.totVotes", target = "totVotes")
    @Mapping(source = "properties.urban", target = "urbanPop")
    @Mapping(source = "properties.rural", target = "ruralPop")
    @Mapping(source = "properties.suburban", target = "suburbanPop")
    @Mapping(source = "properties.povertyPct", target = "povertyRate")
    @Mapping(source = "properties.mednInc21", target = "medianIncome")
    @Mapping(target = "racialEthnicPopulation", expression = "java(mapRacialEthnicPopulation(state))")
    @Mapping(target = "incomeDistribution", expression = "java(mapIncomeDistribution(state))")
    StateSummaryDTO toStateSummaryDTO(State state);

    default Map<String, Long> mapRacialEthnicPopulation(State state) {
        State.Properties properties = state.getProperties();
        Map<String, Long> racialEthnicPopulation = new HashMap<>();
        racialEthnicPopulation.put("White", properties.getPopWht());
        racialEthnicPopulation.put("Black", properties.getPopBlk());
        racialEthnicPopulation.put("Hispanic/Latino", properties.getPopHisLat());
        racialEthnicPopulation.put("Asian", properties.getPopAsn());
        racialEthnicPopulation.put("Hipi", properties.getPopHipi());
        racialEthnicPopulation.put("Other", properties.getPopOth());
        racialEthnicPopulation.put("Multiracial", properties.getPopTwoMor());
        return racialEthnicPopulation;
    }
    default Map<String, Long> mapIncomeDistribution(State state) {
        State.Properties properties = state.getProperties();
        Map<String, Long> incomeDistribution = new HashMap<>();
        incomeDistribution.put("<10K", properties.getLess10K21());
        incomeDistribution.put("10K-15K", properties.getK10To15K21());
        incomeDistribution.put("15K-20K", properties.getK15To20K21());
        incomeDistribution.put("20K-25K", properties.getK20To25K21());
        incomeDistribution.put("25K-30K", properties.getK25To30K21());
        incomeDistribution.put("30K-35K", properties.getK30To35K21());
        incomeDistribution.put("35K-40K", properties.getK35To40K21());
        incomeDistribution.put("40K-45K", properties.getK40To45K21());
        incomeDistribution.put("45K-50K", properties.getK45To50K21());
        incomeDistribution.put("50K-60K", properties.getK50To60K21());
        incomeDistribution.put("60K-75K", properties.getK60To75K21());
        incomeDistribution.put("75K-100K", properties.getK75To100K21());
        incomeDistribution.put("100K-125K", properties.getK100To125K21());
        incomeDistribution.put("125K-150K", properties.getK125To150K21());
        incomeDistribution.put("150K-200K", properties.getK150To200K21());
        incomeDistribution.put("200K+", properties.getK200KMor21());
        return incomeDistribution;
    }

}
