https://docs.google.com/document/d/1C9FLcbXFKteyua69LbAV_jlFW451Abi3zdv5Ncty6yM/edit?usp=sharing

Prepro‐1. Integrate multiple data sources (required) (AD)   
Integrate and merge US Census data (income, region type (rural, urban, suburban) population, both for total and for any opportunity groups), precinct data (boundary, name, demographics, etc.), and existing district data (boundary, name, district#, etc.). Geographic boundary data should be converted (if necessary) to a consistent format (e.g., GeoJSON). 

data/preprocessing/cali-preprocessing.ipnyb
data/preprocessing/alabama-preprocessing.ipnyb
https://drive.google.com/file/d/1Gq2IbiZifLMJtYQBV1jTtEtyPWPBVxrT/view?usp=drive_link


Prepro‐2. Identify precinct neighbors (required) (AD) 
Identify two precincts as neighbors if they share a common boundary of at least 200 feet and the edges of each precinct are within 200 feet of its neighbors’ edges. If possible, try to locate a data source for which this computation is already done. 

data\preprocessing\neighbor_adjacency.ipynb
https://drive.google.com/file/d/1Gq2IbiZifLMJtYQBV1jTtEtyPWPBVxrT/view?usp=drive_link


Prepro‐3. Integrate enacted plan with dataset (required) 
Integrate the enacted plan for the state within the server database. 

data/preprocessing/cali-preprocessing.ipnyb
data/preprocessing/alabama-preprocessing.ipnyb


Prepro‐4. Store preprocessed data (required) 
The preprocessed data should be stored in the NoSQL or relational database. If a relational database is used, the data should be stored in third normal form. Data might also be stored in a file system accessible to the server

data/preprocessing/cali-preprocessing.ipnyb
data/preprocessing/alabama-preprocessing.ipnyb


Prepro‐5. Store SeaWulf data (required) 
Retrieve generated data from SeaWulf for each of your states, convert to an appropriate format, and store either in your database or in a file system. Data stored in a file system should be accessible through a path obtained from your database.  

data\seawulf\alabama.py
data\seawulf\california.py

Prepro‐6. Calculate statewide measures (required)
Overall state measures include percentage of Republican voters, percentage of Democratic
voters, percentage of each of the demographic groups relevant for the state and percentage of
population by region type (rural, urban, suburban). A demographic group is considered
relevant for a state if the population of the group is sufficient to provide a winning vote margin
in at least one district. You should estimate the percentage of voters in each party by analyzing
the votes for each party in each precinct in some statewide election (e.g., presidential, attorney
general, governor).

data/preprocessing/cali-preprocessing.ipnyb
data/preprocessing/alabama-preprocessing.ipnyb


Prepro‐7. Generate data files required for SeaWulf processing (required) (AD)
Generate all the data files required for SeaWulf processing. This will include the graph
representation of the precincts in a state as well as geographic, election, and incumbent data for
each precinct.

data\seawulf\alabama.py
data\seawulf\california.py
data\seawulf\seawulf.ipynb


Prepro‐8. Gingles 2/3 precinct analysis (required) (AD)
Perform a precinct-by-precinct analysis of voting results and minority population percentage
for some statewide race (2022 or 2020). For each precinct, the analysis will identify the
winning party, the Republican vote share, the Democratic vote share, the population percentage
of each significant racial/ethnic group, the population by region type (rural, urban, suburban),
and the average household income. The analysis is repeated for each feasible racial/ethnic
group in the state.

data\preprocessing\gingles_analysis.ipynb


Prepro‐9. Gingles 2/3 non‐linear regression analysis (required) (AD)
For the statewide race used in the use case above, calculate the non-linear regression curve for
the Republican and Democratic precinct values for each Gingles 2/3 graph. Multiple equation
forms will be used to determine the best form for non-linear regression.

data\preprocessing\gingles_analysis.ipynb


Prepro‐10. Use the PyEI MGGG software to calculate Ecological Inference data (required)
Use the PyEI MGGG software to calculate results for multiple statewide races.


Prepro‐11. Calculate the vote share vs seat share curve data (preferred)
Using the Shen software as a starting point, calculate the data for the vote share vs. seat share
curve in any of your states that display racially polarized voting. Use the current district plan as
the basis for the calculation. Also use relatively fine grain increments of vote share and possibly
randomization to reduce a stair-stepping effect.


Prepro‐12. Calculate region type for each precinct (required)
Calculate the region type (rural, urban, and suburban) for each precinct. You can use some
reasonable values for the ratio of area to population to determine the classification of each
precinct. 

data/preprocessing/cali-preprocessing.ipnyb
data/preprocessing/alabama-preprocessing.ipnyb
