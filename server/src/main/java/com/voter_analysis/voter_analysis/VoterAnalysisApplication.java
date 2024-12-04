package com.voter_analysis.voter_analysis;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@EnableCaching
@SpringBootApplication
public class VoterAnalysisApplication {

	public static void main(String[] args) {
		SpringApplication.run(VoterAnalysisApplication.class, args);
	}

}
