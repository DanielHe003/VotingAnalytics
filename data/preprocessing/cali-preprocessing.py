# Data Sources For California:
# link to google drive https://drive.google.com/drive/folders/1XzKB937g9O4VwLNoCqQ39a-XYAhB_IqM?usp=drive_link
# ca_inc_2021_bg.json (income data)(Needs to be cleaned)
# CA_block_2020.json (Block Data Geojson)
# nhgis0015_ds258_2020_block.csv (Block Demographic)
# ca_cvap_2020_2020_b.json (Block Data Geojson CVAP)
# srprec_state_g20_v01_shp.json (Precinct Geojson)
# state_g20_voters_by_g20_srprec.csv (Precint Voting Info)
# CD_Final 2021-12-20.json (Congressional District Geojson)

import pandas as pd
import geopandas as gpd
import maup
import numpy as np


working_directory = "/Users/stanleymui/Downloads/CSE 416 Preprocessing Data/"

# Demographic Voting Age Block Data
df_block = pd.read_csv(working_directory + "nhgis0015_ds258_2020_block.csv")
df_block = df_block[['GEOID', 'U7R001', 'U7R002', 'U7R005', 'U7R006', 'U7R007', 'U7R008', 'U7R009', 'U7R010', 'U7R011']]
df_block = df_block.rename(columns={'GEOID': 'GEOID20', 'U7R001': 'TOT_POP', 'U7R002': 'POP_HISLAT', 'U7R005': 'POP_WHT', 'U7R006': 'POP_BLK'
                                    ,'U7R007': 'POP_AINDALK', 'U7R008': 'POP_ASN', 'U7R009': 'POP_HIPI', 'U7R010': 'POP_OTH'
                                   ,'U7R011': 'POP_TWOMOR'})
df_block['GEOID20'] = df_block['GEOID20'].str.replace('1000000US', '', regex=False)
# display(df_block)

gdf = gpd.read_file(working_directory + "ca_cvap_2020_2020_b.json")
gdf_block = gdf[['GEOID20', 'geometry']]

# Merge Block Data with Demographic Data
merged_gdf_block = gdf_block.merge(df_block, on='GEOID20')
merged_gdf_block.to_crs(inplace=True, crs="EPSG:3857")
# display(merged_gdf_block)

# Precinct data
df_precinct = pd.read_csv(working_directory + "state_g20_sov_data_by_g20_srprec.csv")
gdf_precinct = gpd.read_file(working_directory + "srprec_state_g20_v01_shp.json")
df_precinct  = df_precinct[['SRPREC_KEY', 'PRSDEM01', 'PRSREP01']]
# Calculate the total votes for each precinct
df_precinct['TOT_VOTES'] = df_precinct['PRSDEM01'] + df_precinct['PRSREP01']
# Now, calculate the percentage of Democratic votes
df_precinct['PCT_DEM'] = (df_precinct['PRSDEM01'] / df_precinct['TOT_VOTES']) * 100
# Calculate the percentage of Republican votes
df_precinct['PCT_REP'] = (df_precinct['PRSREP01'] / df_precinct['TOT_VOTES']) * 100
df_precinct['RESULT'] = df_precinct.apply(lambda row: 'dem' if row['PRSDEM01'] > row['PRSREP01'] else 'rep', axis=1)

#display(df_precinct)
#display(gdf_precinct)

# Merge Precinct Data with Election Data

merged_precinct_gdf = gdf_precinct.merge(df_precinct, on='SRPREC_KEY')
merged_precinct_gdf = merged_precinct_gdf[['SRPREC_KEY', 'RESULT', 'PCT_DEM', 'PCT_REP', 'TOT_VOTES' ,'geometry']]
merged_precinct_gdf.to_crs(inplace=True, crs="EPSG:3857")
# display(merged_precinct_gdf)

variables = ['TOT_POP', 'POP_HISLAT', 'POP_WHT', 'POP_BLK', 'POP_AINDALK', 'POP_ASN', 'POP_HIPI', 'POP_OTH','POP_TWOMOR']

blocks_to_precincts_assignment = maup.assign(merged_gdf_block, merged_precinct_gdf)
merged_precinct_gdf[variables] = merged_gdf_block[variables].groupby(blocks_to_precincts_assignment).sum()
# display(merged_precinct_gdf)
# merged_precinct_gdf.plot()

# Income Data In the Block Group Level
gdf_income_bg = gpd.read_file(working_directory + "ca_inc_2021_bg.json")
gdf_income_bg.to_crs(inplace=True, crs="EPSG:3857")

# display(gdf_income_bg)

income_columns = ['LESS_10K21', '10K_15K21', '15K_20K21', '20K_25K21', '25K_30K21', '30K_35K21',
                 '35K_40K21', '40K_45K21', '45K_50K21', '50K_60K21', '60K_75K21', '75K_100K21',
                  '100_125K21', '125_150K21', '150_200K21', '200K_MOR21']

income_values = [5000, 12500, 17500, 22500, 27500, 32500,
                 37500, 42500, 47500, 55000, 67500, 87500,
                  112500, 137500, 175000, 200000]


# Function to get the column where cumulative sum equals or exceeds half of TOT_HOUSE21

def find_median_income_column(row):
    if np.isnan(row['MEDN_INC21']):
        total_houses = row['TOT_HOUS21']
        half_houses = total_houses / 2
        cumulative_sum = 0
    
        for col, income_value in zip(income_columns, income_values):
            cumulative_sum += row[col]
            if cumulative_sum >= half_houses:
                return income_value
    return row['MEDN_INC21']

# display(gdf_income_bg)

income_variables = ['TOT_HOUS21','LESS_10K21', '10K_15K21', '15K_20K21', '20K_25K21', '25K_30K21',
                    '30K_35K21','35K_40K21', '40K_45K21', '45K_50K21', '50K_60K21',
                    '60K_75K21', '75K_100K21','100_125K21', '125_150K21', '150_200K21', '200K_MOR21']

blocks_group_to_precinct_assignment = maup.assign(gdf_income_bg, merged_precinct_gdf)
merged_precinct_gdf[income_variables] = gdf_income_bg[income_variables].groupby(blocks_group_to_precinct_assignment).sum()

merged_precinct_gdf.fillna(0, inplace=True)

# print(merged_precinct_gdf.columns)

merged_precinct_gdf['MEDN_INC21'] = np.nan

# Apply the function to each row and store the result in a new column
merged_precinct_gdf['MEDN_INC21'] = merged_precinct_gdf.apply(find_median_income_column, axis=1)

# display(merged_precinct_gdf)

gdf_congressional_district = gpd.read_file(working_directory + 'CD_Final 2021-12-20.json')
gdf_congressional_district.to_crs(inplace=True, crs="EPSG:3857")

precinct_to_cd_assignment = maup.assign(merged_precinct_gdf, gdf_congressional_district)
merged_precinct_gdf['CD_ID'] = precinct_to_cd_assignment

# display(merged_precinct_gdf)
# print(merged_precinct_gdf['CD_ID'].unique())