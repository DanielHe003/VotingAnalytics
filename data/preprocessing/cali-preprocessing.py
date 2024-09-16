# Data Sources For California:
# link to google drive https://drive.google.com/drive/folders/1XzKB937g9O4VwLNoCqQ39a-XYAhB_IqM?usp=drive_link
# ca_inc_2021_bg.json (income data)(Needs to be cleaned)
# ca_cvap_2020_2020_b.json (Block Data Geojson)
# srprec_state_g20_v01_shp.json (Precinct Geojson)
# state_g20_voters_by_g20_srprec.csv (Precint Voting Info)
# CD_Final 2021-12-20.json (Congressional District Geojson)

import geopandas as gpd
import maup
import pandas as pd
import os
working_directory = "/Users/stanleymui/Downloads/CSE 416 Preprocessing Data/"

# Demographic Citizen Voting Age block data
gdf = gpd.read_file(working_directory + "ca_cvap_2020_2020_b.json")
gdf_block = gdf[['GEOID20', 'CVAP_TOT20', 'CVAP_AIA20', 'CVAP_ASN20', 'CVAP_BLK20',
                'CVAP_NHP20', 'CVAP_WHT20', 'CVAP_HSP20', 'geometry']]
gdf_block.to_crs(inplace=True, crs="EPSG:3857")
# display(gdf_block)

# Combine with Precinct data
df = pd.read_csv(working_directory + "state_g20_sov_data_by_g20_srprec.csv")
gdf_precinct = gpd.read_file(working_directory + "srprec_state_g20_v01_shp.json")
df = df[['SRPREC_KEY', 'PRSDEM01', 'PRSREP01']]
df['Winner'] = df.apply(lambda row: 'dem' if row['PRSDEM01'] > row['PRSREP01'] else 'rep', axis=1)

# Count the occurrences of 'rep' and 'dem' in the 'Winner' column
#winner_counts = df['Winner'].value_counts()
#print(f"Total rep precinct {winner_counts}")

# Total votes for 'PRSDEM01' and 'PRSREP01'
#total_dem_votes = df['PRSDEM01'].sum()
#total_rep_votes = df['PRSREP01'].sum()

#print(f"Total Democratic votes: {total_dem_votes}")
#print(f"Total Republican votes: {total_rep_votes}")

#display(df)
#display(gdf_precinct)

# Merge df and gdf_precinct on 'SRPREC_KEY'
merged_precinct_gdf = gdf_precinct.merge(df, on='SRPREC_KEY')
merged_precinct_gdf = merged_precinct_gdf[['SRPREC_KEY', 'Winner', 'geometry']]

# Display the merged GeoDataFrame
merged_precinct_gdf.to_crs(inplace=True, crs="EPSG:3857")
# display(merged_precinct_gdf)

variables = ['CVAP_TOT20', 'CVAP_AIA20', 'CVAP_ASN20', 'CVAP_BLK20',
                'CVAP_NHP20', 'CVAP_WHT20', 'CVAP_HSP20']
blocks_to_precincts_assignment = maup.assign(gdf_block, merged_precinct_gdf)
merged_precinct_gdf[variables] = gdf_block[variables].groupby(blocks_to_precincts_assignment).sum()
merged_precinct_gdf.head()

# Count the occurrences of 'rep' and 'dem' in the 'Winner' column
# winner_counts = merged_precinct_gdf['Winner'].value_counts()
# print(f"Total rep precinct {winner_counts}")

# merged_precinct_gdf.plot()

# Income
# gdf = gpd.read_file(working_directory + "ca_inc_2021_bg.json")
# Filter rows where 'MEDN_INC21' is NaN
# nan_rows = gdf[gdf['MEDN_INC21'].isna()]
# display(nan_rows)