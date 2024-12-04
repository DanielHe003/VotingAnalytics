import pandas as pd
import os
import geopandas as gpd
import zipfile
import concurrent.futures
import logging
from tqdm import tqdm

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def finding_points(list_pct):
    if len(list_pct) % 2 == 0:
        half = len(list_pct) // 2
        list_left = list_pct[:half]
        list_right = list_pct[half:]

        min_val = list_pct[0]
        max_val = list_pct[-1]
        Q1 = (list_left[len(list_left) // 2] + list_left[(len(list_left) // 2) - 1]) / 2
        Q2 = (list_pct[len(list_pct) // 2] + list_pct[(len(list_pct) // 2) - 1]) / 2
        Q3 = (list_right[len(list_right) // 2] + list_right[(len(list_right) // 2) - 1]) / 2
        IQR = Q3 - Q1
    else:
        half = len(list_pct) // 2
        list_left = list_pct[:half]
        list_right = list_pct[half + 1:]

        min_val = list_pct[0]
        max_val = list_pct[-1]
        Q1 = (list_left[len(list_left) // 2] + list_left[(len(list_left) // 2) - 1]) / 2
        Q2 = list_pct[len(list_pct) // 2]
        Q3 = (list_right[len(list_right) // 2] + list_right[(len(list_right) // 2) - 1]) / 2
        IQR = Q3 - Q1

    outlier_lowerbound = Q1 - 1.5 * IQR
    outlier_upperbound = Q3 + 1.5 * IQR

    while min_val < outlier_lowerbound:
        min_val = list_pct[0]
        list_pct.pop(0)

    while max_val > outlier_upperbound:
        max_val = list_pct[-1]
        list_pct.pop(-1)

    return min_val, max_val, Q1, Q2, Q3

def finding_boxandwhiskerpoints(folder_path, output_path, state, num_districts, region=None):
    if region:
        if region == "Suburban":
            race_data = ['suburban_black_pct', 'suburban_white_pct', 'suburban_asian_pct'
                         ,'suburban_hispanic_pct', 'suburban_aindalk_pct', 'suburban_hipi_pct'
                         , 'suburban_other_pct', 'suburban_twoormore_pct']
        elif region == "Urban":
            race_data = ['urban_black_pct', 'urban_white_pct',
                        'urban_asian_pct', 'urban_hispanic_pct',
                        'urban_aindalk_pct', 'urban_hipi_pct',
                        'urban_other_pct', 'urban_twoormore_pct']
        elif region == "Rural":
            race_data = ['rural_black_pct', 'rural_white_pct',
                         'rural_asian_pct', 'rural_hispanic_pct',
                         'rural_aindalk_pct', 'rural_hipi_pct',
                         'rural_other_pct', 'rural_twoormore_pct']
    else:
        race_data = ['black_pct', 'white_pct', 'asian_pct',
                     'hispanic_pct', 'aindalk_pct', 'hipi_pct',
                     'other_pct', 'twoormore_pct']

    for race in race_data:
        print(race)
        result_data = []
        race_pct_by_district = {num: [] for num in range(1, num_districts + 1)}
        for filename in os.listdir(folder_path):
            if filename.endswith(".geojson"):
                filepath = os.path.join(folder_path, filename)
                try:
                    gdf = gpd.read_file(filepath)
                    gdf = gdf.sort_values(by=race, ascending=True)
                    district_id = 1
                    for district_index, district_data in gdf.iterrows():
                        race_pct = district_data[race]
                        race_pct_by_district[district_id].append(race_pct)
                        district_id += 1
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

        for district_id, pct_list in race_pct_by_district.items():
            logging.error("error here.")
            pct_list.sort()
            min_val, max_val, Q1, Q2, Q3 = finding_points(pct_list)
            result_data.append({
                'race': race,
                'district_id': district_id,
                'min': min_val,
                'Q1': Q1,
                'Q2': Q2,
                'Q3': Q3,
                'max': max_val
            })
        df = pd.DataFrame(result_data)
        # display(df)
        final_output = output_path
        final_output += race
        df.to_csv(final_output + "_" + state + ".csv", index=False)

# Function to compute and store box-and-whisker stats for each economic group
def finding_boxandwhiskerpoints_economic(folder_path, output_path, state, num_districts):
    economic_group = ["low_income_pct", "low_middle_income_pct", "upper_middle_income_pct", "upper_income_pct"]

    for group in economic_group:
        print(group)
        result_data = []
        economic_pct_by_district = {num: [] for num in range(1, num_districts + 1)}
        for filename in os.listdir(folder_path):
            if filename.endswith(".geojson"):
                filepath = os.path.join(folder_path, filename)
                try:
                    gdf = gpd.read_file(filepath)
                    gdf = gdf.sort_values(by=group, ascending=True)
                    district_id = 1
                    for district_index, district_data in gdf.iterrows():
                        economic_pct = district_data[group]
                        economic_pct_by_district[district_id].append(economic_pct)
                        district_id += 1
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

        for district_id, pct_list in economic_pct_by_district.items():
            pct_list.sort()
            min_val, max_val, Q1, Q2, Q3 = finding_points(pct_list)
            result_data.append({
                'economic_group': group,
                'district_id': district_id,
                'min': min_val,
                'Q1': Q1,
                'Q2': Q2,
                'Q3': Q3,
                'max': max_val
            })
        df = pd.DataFrame(result_data)
        # display(df)
        final_output = output_path
        final_output += group
        df.to_csv(final_output + "_" + state + ".csv", index=False)

# Function to compute and store box-and-whisker stats for each region group
def finding_boxandwhiskerpoints_region(folder_path, output_path, state, num_districts):
    region_group = ["rural_population_pct", "urban_population_pct", "suburban_population_pct"]

    for region in region_group:
        print(region)
        result_data = []
        region_pct_by_district = {num: [] for num in range(1, num_districts + 1)}
        for filename in os.listdir(folder_path):
            if filename.endswith(".geojson"):
                filepath = os.path.join(folder_path, filename)
                try:
                    gdf = gpd.read_file(filepath)
                    gdf = gdf.sort_values(by=region, ascending=True)
                    district_id = 1
                    for district_index, district_data in gdf.iterrows():
                        region_pct = district_data[region]
                        region_pct_by_district[district_id].append(region_pct)
                        district_id += 1
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

        for district_id, pct_list in region_pct_by_district.items():
            pct_list.sort()
            min_val, max_val, Q1, Q2, Q3 = finding_points(pct_list)
            result_data.append({
                'region': region,
                'district_id': district_id,
                'min': min_val,
                'Q1': Q1,
                'Q2': Q2,
                'Q3': Q3,
                'max': max_val
            })
        df = pd.DataFrame(result_data)
        # display(df)
        final_output = output_path
        final_output += region
        df.to_csv(final_output + "_" + state + ".csv", index=False)

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    cwd = os.getcwd()
    folder_path = cwd
    output_path = cwd

    # Use os.cpu_count() to utilize all available cores
    max_workers = os.cpu_count()
    logging.info(f"Using up to {max_workers} workers")

    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        try:
            logging.info("Submitting tasks for analysis")
            futures.append(executor.submit(finding_boxandwhiskerpoints, folder_path, output_path, "CA", 53, "Urban"))
            futures.append(executor.submit(finding_boxandwhiskerpoints, folder_path, output_path, "CA", 53, "Suburban"))
            futures.append(executor.submit(finding_boxandwhiskerpoints, folder_path, output_path, "CA", 53, "Rural"))
            futures.append(executor.submit(finding_boxandwhiskerpoints, folder_path, output_path, "CA", 53, None))
            futures.append(executor.submit(finding_boxandwhiskerpoints_economic, folder_path, output_path, "CA", 53))
            futures.append(executor.submit(finding_boxandwhiskerpoints_region, folder_path, output_path, "CA", 53))
        except Exception as e:
            logging.error(f"Error submitting tasks: {e}")

        for future in tqdm(concurrent.futures.as_completed(futures), desc="Processing tasks"):
            try:
                result = future.result()
                logging.info(f"Task completed successfully with result: {result}")
            except Exception as e:
                logging.error(f"Task failed with exception: {e}")