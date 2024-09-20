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

# Demographic Citizen Voting Age block data (CVAP)
# gdf = gpd.read_file(working_directory + "ca_cvap_2020_2020_b.json")
# gdf_block = gdf[['GEOID20', 'CVAP_TOT20', 'CVAP_AIA20', 'CVAP_ASN20', 'CVAP_BLK20',
#                 'CVAP_NHP20', 'CVAP_WHT20', 'CVAP_HSP20', 'geometry']]
# gdf_block.to_crs(inplace=True, crs="EPSG:3857")
# display(gdf_block)

# Demographic Voting Age Block Data
df_block = pd.read_csv(working_directory + "nhgis0015_ds258_2020_block.csv")
df_block = df_block[['GEOID', 'U7R001', 'U7R002', 'U7R005', 'U7R006', 'U7R007', 'U7R008', 'U7R009', 'U7R010', 'U7R011']]
df_block = df_block.rename(columns={'GEOID': 'GEOID20', 'U7R001': 'TOT_POP', 'U7R002': 'POP_HISLAT', 'U7R005': 'POP_WHT', 'U7R006': 'POP_BLK'
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
df_precinct['Winner'] = df_precinct.apply(lambda row: 'dem' if row['PRSDEM01'] > row['PRSREP01'] else 'rep', axis=1)

# Count the occurrences of 'rep' and 'dem' in the 'Winner' column
#winner_counts = df_precinct['Winner'].value_counts()
#print(f"Total rep precinct {winner_counts}")

# Total votes for 'PRSDEM01' and 'PRSREP01'
#total_dem_votes = df_precinct['PRSDEM01'].sum()
#total_rep_votes = df_precinct['PRSREP01'].sum()

#print(f"Total Democratic votes: {total_dem_votes}")
#print(f"Total Republican votes: {total_rep_votes}")

#display(df_precinct)
#display(gdf_precinct)

# Merge Precinct Data with Election Data

merged_precinct_gdf = gdf_precinct.merge(df_precinct, on='SRPREC_KEY')
merged_precinct_gdf = merged_precinct_gdf[['SRPREC_KEY', 'Winner', 'geometry']]
merged_precinct_gdf.to_crs(inplace=True, crs="EPSG:3857")
# display(merged_precinct_gdf)

variables = ['TOT_POP', 'POP_HISLAT', 'POP_WHT', 'POP_BLK', 'POP_AINDALK', 'POP_ASN', 'POP_HIPI', 'POP_OTH','POP_TWOMOR']

blocks_to_precincts_assignment = maup.assign(merged_gdf_block, merged_precinct_gdf)
merged_precinct_gdf[variables] = merged_gdf_block[variables].groupby(blocks_to_precincts_assignment).sum()
# display(merged_precinct_gdf)

# Count the occurrences of 'rep' and 'dem' in the 'Winner' column
# winner_counts = merged_precinct_gdf['Winner'].value_counts()
# print(f"Total rep precinct {winner_counts}")

# merged_precinct_gdf.plot()

# Income Data In the Block Group Level
gdf_income_bg = gpd.read_file(working_directory + "ca_inc_2021_bg.json")
gdf_income_bg.to_crs(inplace=True, crs="EPSG:3857")

# display(gdf_income_bg)

# income_columns = ['LESS_10K21', '10K_15K21', '15K_20K21', '20K_25K21', '25K_30K21', '30K_35K21',
#                  '35K_40K21', '40K_45K21', '45K_50K21', '50K_60K21', '60K_75K21', '75K_100K21',
#                   '100_125K21', '125_150K21', '150_200K21', '200K_MOR21']

# income_values = [5000, 12500, 17500, 22500, 27500, 32500,
#                  37500, 42500, 47500, 55000, 67500, 87500,
#                   112500, 137500, 175000, 200000]


# # Function to get the column where cumulative sum equals or exceeds half of TOT_HOUSE21
#Look at function right below

# def find_median_income_column(row):
#     if np.isnan(row['MEDN_INC21']):
#         total_houses = row['TOT_HOUS21']
#         half_houses = total_houses / 2
#         cumulative_sum = 0
    
#         for col, income_value in zip(income_columns, income_values):
#             cumulative_sum += row[col]
#             if cumulative_sum >= half_houses:
#                 return income_value
#     return row['MEDN_INC21']

# Calculates medium weighted income instead of just average

# def calculate_median_income(row):
#     cumulative_households = row[income_columns].cumsum()
#     total_households = row['TOT_HOUS21']
#     median_index = (cumulative_households >= total_households / 2).idxmax()
#     return income_values[income_columns.index(median_index)]

# gdf_income_bg['MEDN_INC21'] = gdf_income_bg.apply(calculate_median_income, axis=1)



# # Apply the function to each row and store the result in a new column
# gdf_income_bg['MEDN_INC21'] = gdf_income_bg.apply(find_median_income_column, axis=1)
# # display(gdf_income_bg)

income_variables = ['TOT_HOUS21','LESS_10K21', '10K_15K21', '15K_20K21', '20K_25K21', '25K_30K21',
                    '30K_35K21','35K_40K21', '40K_45K21', '45K_50K21', '50K_60K21',
                    '60K_75K21', '75K_100K21','100_125K21', '125_150K21', '150_200K21', '200K_MOR21']

blocks_group_to_precinct_assignment = maup.assign(gdf_income_bg, merged_precinct_gdf)
merged_precinct_gdf[income_variables] = gdf_income_bg[income_variables].groupby(blocks_group_to_precinct_assignment).sum()
# display(merged_precinct_gdf)
# rows_with_na = merged_precinct_gdf[merged_precinct_gdf.isna().any(axis=1)]
# rows_with_na = merged_precinct_gdf[merged_precinct_gdf['TOT_POP'].isna()]
# display(rows_with_na)

