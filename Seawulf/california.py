import pandas as pd
import json
from shapely.geometry import shape
from shapely.ops import unary_union
import geopandas as gpd
from gerrychain.constraints import within_percent_of_ideal_population
from gerrychain.proposals import recom
from gerrychain.updaters import Tally, cut_edges
from functools import partial
from gerrychain import Graph, Partition, GeographicPartition, MarkovChain
from gerrychain.tree import recursive_tree_part
from gerrychain.accept import always_accept
import os
import logging
import concurrent.futures
import multiprocessing as mp
import warnings
import tqdm
import time

warnings.filterwarnings("ignore")
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(processName)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler() 
    ]
)


def process_plan(plan_num, working_directory, output_path, state, data, num_districts):
    logging.info(f"Starting plan {plan_num+1}...")

    graph = Graph.from_file(working_directory + data)
    # logging.debug(f"Graph loaded from {working_directory + data}")
    
    updaters = {
        "population": Tally("TOT_POP", alias="population"),
        "cut_edges": cut_edges,
        "democrats": Tally("PRSDEM01", alias="democrats"),
        "republicans": Tally("PRSREP01", alias="republicans"),
        "black": Tally("POP_BLK", alias="black"),
        "white": Tally("POP_WHT", alias="white"),
        "asian": Tally("POP_ASN", alias="asian"),
        "hispanic": Tally("POP_HISLAT", alias="hispanic"),
        "aindalk": Tally("POP_AINDALK", alias="aindalk"),
        "hipi": Tally("POP_HIPI", alias="hipi"),
        "other": Tally("POP_OTH", alias="other"),
        "twoormore": Tally("POP_TWOMOR", alias="twoormore"),
        "urban": Tally("Urban", alias="urban"),
        "suburban": Tally("Suburban", alias="suburban"),
        "rural": Tally("Rural", alias="rural"),
        "arealand": Tally("AREALAND", alias="arealand"),
    }
    logging.debug(f"Updaters initialized.")

    total_population = sum(graph.nodes[node]["TOT_POP"] for node in graph.nodes)
    ideal_population = total_population / num_districts
    epsilon = 0.1
    
    district_labels = list(range(1, num_districts + 1))
    
    logging.debug(f"Total population: {total_population}, Ideal population per district: {ideal_population}")
    new_assignment = recursive_tree_part(
        graph,
        parts=district_labels,
        pop_target=ideal_population,
        pop_col="TOT_POP",
        epsilon=epsilon,
        node_repeats=1,
    )
    
    logging.debug(f"New assignment for plan {plan_num+1} created.")
    logging.info(f"Finished new assignment for plan {plan_num+1}.")

    initial_partition = Partition(
        graph,
        assignment=new_assignment,
        updaters=updaters,
    )
    
    logging.debug(f"Initial partition created for plan {plan_num+1}.")

    proposal = partial(recom, pop_col="TOT_POP", pop_target=ideal_population, epsilon=0.1, node_repeats=2)
    pop_constraint = within_percent_of_ideal_population(initial_partition, 0.1)

    chain = MarkovChain(
        proposal=proposal,
        constraints=pop_constraint,
        accept=always_accept,
        initial_state=initial_partition,
        total_steps=10000
    )

    final_results = {
            "district": [],
            "democrats": [],
            "republicans": [],
            "winner": [],
            "black_pct": [],
            "white_pct": [],
            "asian_pct": [],
            "hispanic_pct": [],
            "aindalk_pct": [],
            "hipi_pct": [],
            "other_pct": [],
            "twoormore_pct": [],
            "rural_black_pct": [],
            "rural_white_pct": [],
            "rural_asian_pct": [],
            "rural_hispanic_pct": [],
            "rural_aindalk_pct": [],
            "rural_hipi_pct": [],
            "rural_other_pct": [],
            "rural_twoormore_pct": [],
            "suburban_black_pct": [],
            "suburban_white_pct": [],
            "suburban_asian_pct": [],
            "suburban_hispanic_pct": [],
            "suburban_aindalk_pct": [],
            "suburban_hipi_pct": [],
            "suburban_other_pct": [],
            "suburban_twoormore_pct": [],
            "urban_black_pct": [],
            "urban_white_pct": [],
            "urban_asian_pct": [],
            "urban_hispanic_pct": [],
            "urban_aindalk_pct": [],
            "urban_hipi_pct": [],
            "urban_other_pct": [],
            "urban_twoormore_pct": [],
            "total_population": [],
            "rural_population": [],
            "urban_population": [],
            "suburban_population": [],
            "category": [],
            "geometry": [],
        }    
       
    logging.debug("Initialized final results structure.")

    plan_summary = {
        "plan_num": [plan_num + 1], 
        "avg_income_difference": [],
        "avg_dem_support": [],
        "avg_rep_support": [],
        "rep_districts": [],
        "dem_districts": [],
        "rural_districts": [],
        "urban_districts": [],
        "suburban_districts": [],
        "poverty_districts": [],
        
    }

    statewide_average_income = 0
    # Calculate Measures
    if state == "CA":
        statewide_average_income = 95777.82
    elif state == "AL":
        statewide_average_income = 56036.51

    logging.debug(f"Statewide average income for {state}: {statewide_average_income}")

    current_plan_income_difference = 0
    current_plan_dem_pct = 0
    current_plan_rep_pct = 0
    num_rep_districts = 0
    num_dem_districts = 0
    num_rural_districts = 0
    num_urban_districts = 0
    num_suburban_districts = 0
    num_poverty_districts = 0

    for partition in chain:
        pass

    final_partition = partition 
    logging.debug("Final partition after chain execution.")
    
    all_precincts = graph.nodes(data=True)

    rural_precincts = {k: v for k, v in all_precincts if v["Category"] == "Rural"}
    suburban_precincts = {k: v for k, v in all_precincts if v["Category"] == "Suburban"}
    urban_precincts = {k: v for k, v in all_precincts if v["Category"] == "Urban"}
    
    logging.debug(f"Filtered precincts by region categories: Rural {len(rural_precincts)}, Suburban {len(suburban_precincts)}, Urban {len(urban_precincts)}")

    for district in final_partition["democrats"].keys():
        dem_count = final_partition["democrats"].get(district, 0)
        rep_count = final_partition["republicans"].get(district, 0)
        black_count = final_partition["black"].get(district, 0)
        white_count = final_partition["white"].get(district, 0)
        asian_count = final_partition["asian"].get(district, 0)
        hispanic_count = final_partition["hispanic"].get(district, 0)
        aindalk_count = final_partition["aindalk"].get(district, 0)
        hipi_count = final_partition["hipi"].get(district, 0)
        other_count = final_partition["other"].get(district, 0)
        twoormore_count = final_partition["twoormore"].get(district, 0)
        total_population = final_partition["population"].get(district, 0)

        final_results["district"].append(district)
        final_results["democrats"].append(dem_count)
        final_results["republicans"].append(rep_count)

        if dem_count > rep_count:
            final_results["winner"].append("democrats")
            num_dem_districts += 1
        else:
            final_results["winner"].append("republicans")
            num_rep_districts += 1

        current_plan_dem_pct += (dem_count) / (dem_count + rep_count) if (dem_count + rep_count) > 0 else 0
        current_plan_rep_pct += (rep_count) / (dem_count + rep_count) if (dem_count + rep_count) > 0 else 0


        area = final_partition["arealand"][district]
        density = (total_population / area) * 1000 if area > 0 else 0

        if density < 0.1:
            final_results["category"].append("Rural")
            num_rural_districts += 1
        elif density > 3:
            final_results["category"].append("Urban")
            num_urban_districts += 1
        else:
            final_results["category"].append("Suburban")
            num_suburban_districts += 1


        total_population = total_population if total_population > 0 else 1  
        final_results["black_pct"].append(black_count/total_population)
        final_results["white_pct"].append(white_count/total_population)
        final_results["asian_pct"].append(asian_count/total_population)
        final_results["hispanic_pct"].append(hispanic_count/total_population)
        final_results["aindalk_pct"].append(aindalk_count/total_population)
        final_results["hipi_pct"].append(hipi_count/total_population)
        final_results["other_pct"].append(other_count/total_population)
        final_results["twoormore_pct"].append(twoormore_count/total_population)
        final_results["total_population"].append(total_population)
        

        precinct_geometries = []
        for precinct in final_partition.assignment:
            if final_partition.assignment[precinct] == district:
                geometry = graph.nodes[precinct]["geometry"]
                precinct_geometries.append(shape(geometry))  # Convert geometry to Shapely object
            
        combined_geometry = unary_union(precinct_geometries)  # Union all the precinct geometries
            
        final_results["geometry"].append(combined_geometry)
            
        plan_summary["avg_dem_support"].append(current_plan_dem_pct/num_districts)
        plan_summary["avg_rep_support"].append(current_plan_rep_pct/num_districts)
        plan_summary["rep_districts"].append(num_rep_districts)
        plan_summary["dem_districts"].append(num_dem_districts)
        plan_summary["rural_districts"].append(num_rural_districts)
        plan_summary["urban_districts"].append(num_urban_districts)
        plan_summary["suburban_districts"].append(num_suburban_districts)
    
    
    for district in final_partition["population"].keys():
        total_rural_population = final_partition["rural"][district]
        total_suburban_population = final_partition["suburban"][district]
        total_urban_population = final_partition["urban"][district]

        # rural
        rural_black_count = 0
        rural_white_count = 0
        rural_asian_count = 0
        rural_hispanic_count = 0
        rural_aindalk_count = 0
        rural_hipi_count = 0
        rural_other_count = 0
        rural_twoormore_count = 0
        
        for precinct, attributes in rural_precincts.items():
            if final_partition.assignment[precinct] == district:
                rural_black_count += attributes["POP_BLK"]
                rural_white_count += attributes["POP_WHT"]
                rural_asian_count += attributes["POP_ASN"]
                rural_hispanic_count += attributes["POP_HISLAT"]
                rural_aindalk_count += attributes["POP_AINDALK"]
                rural_hipi_count += attributes["POP_HIPI"]
                rural_other_count += attributes["POP_OTH"]
                rural_twoormore_count += attributes["POP_TWOMOR"]

        final_results["rural_black_pct"].append(rural_black_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_white_pct"].append(rural_white_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_asian_pct"].append(rural_asian_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_hispanic_pct"].append(rural_hispanic_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_aindalk_pct"].append(rural_aindalk_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_hipi_pct"].append(rural_hipi_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_other_pct"].append(rural_other_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_twoormore_pct"].append(rural_twoormore_count/total_rural_population if total_rural_population > 0 else 0)
        final_results["rural_population"].append(total_rural_population)
        
        # suburban
        suburban_black_count = 0
        suburban_white_count = 0
        suburban_asian_count = 0
        suburban_hispanic_count = 0
        suburban_aindalk_count = 0
        suburban_hipi_count = 0
        suburban_other_count = 0
        suburban_twoormore_count = 0
        
        for precinct, attributes in suburban_precincts.items():
            if final_partition.assignment[precinct] == district:
                suburban_black_count += attributes["POP_BLK"]
                suburban_white_count += attributes["POP_WHT"]
                suburban_asian_count += attributes["POP_ASN"]
                suburban_hispanic_count += attributes["POP_HISLAT"]
                suburban_aindalk_count += attributes["POP_AINDALK"]
                suburban_hipi_count += attributes["POP_HIPI"]
                suburban_other_count += attributes["POP_OTH"]
                suburban_twoormore_count += attributes["POP_TWOMOR"]

        final_results["suburban_black_pct"].append(suburban_black_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_white_pct"].append(suburban_white_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_asian_pct"].append(suburban_asian_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_hispanic_pct"].append(suburban_hispanic_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_aindalk_pct"].append(suburban_aindalk_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_hipi_pct"].append(suburban_hipi_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_other_pct"].append(suburban_other_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_twoormore_pct"].append(suburban_twoormore_count/total_suburban_population if total_suburban_population > 0 else 0)
        final_results["suburban_population"].append(total_suburban_population)
        
        # urban
        urban_black_count = 0
        urban_white_count = 0
        urban_asian_count = 0
        urban_hispanic_count = 0
        urban_aindalk_count = 0
        urban_hipi_count = 0
        urban_other_count = 0
        urban_twoormore_count = 0
        
        for precinct, attributes in urban_precincts.items():
            if final_partition.assignment[precinct] == district:
                urban_black_count += attributes["POP_BLK"]
                urban_white_count += attributes["POP_WHT"]
                urban_asian_count += attributes["POP_ASN"]
                urban_hispanic_count += attributes["POP_HISLAT"]
                urban_aindalk_count += attributes["POP_AINDALK"]
                urban_hipi_count += attributes["POP_HIPI"]
                urban_other_count += attributes["POP_OTH"]
                urban_twoormore_count += attributes["POP_TWOMOR"]

        final_results["urban_black_pct"].append(urban_black_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_white_pct"].append(urban_white_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_asian_pct"].append(urban_asian_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_hispanic_pct"].append(urban_hispanic_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_aindalk_pct"].append(urban_aindalk_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_hipi_pct"].append(urban_hipi_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_other_pct"].append(urban_other_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_twoormore_pct"].append(urban_twoormore_count/total_urban_population if total_urban_population > 0 else 0)
        final_results["urban_population"].append(total_urban_population)

    # income data

    eligible_precincts = graph.nodes(data=True)
    eligible_precincts = {k: v for k, v in eligible_precincts if v["TOT_HOUS21"] > 0.0}

    for district in final_partition["population"].keys():
        total_income = 0
        precinct_count = 0

        for precinct, attributes in eligible_precincts.items():
            if final_partition.assignment[precinct] == district:
                total_income += attributes["MEDN_INC21"]
                precinct_count += 1

        district_income = total_income / precinct_count if precinct_count > 0 else 0
        current_plan_income_difference += district_income - statewide_average_income
        
        if district_income <= 40000:
            num_poverty_districts += 1

    plan_summary["avg_income_difference"].append(current_plan_income_difference/num_districts)
    plan_summary["poverty_districts"].append(num_poverty_districts)

    logging.info(f"Plan {plan_num + 1} completed.")
    
    return plan_num, final_results, (plan_summary)


def seawulf(working_directory, output_path, state, data, num_plans, num_districts):
    logging.info("Starting the seawulf process")
    logging.info(f"Starting multiprocessing with {mp.cpu_count()} cores")

    all_plan_summaries = []

    tasks = [
        (i, working_directory, output_path, state, data, num_districts)
        for i in range(num_plans)
    ]
    logging.debug(f"Tasks prepared for {num_plans} plans.")

    os.makedirs(output_path, exist_ok=True)

    with concurrent.futures.ProcessPoolExecutor() as executor:
        futures = [executor.submit(process_plan, *task) for task in tasks]
        logging.debug("Tasks submitted for processing.")

        for future in concurrent.futures.as_completed(futures):
            try:
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                index, final_results, plan_summary = future.result()

                # Save the GeoJSON for each plan
                district_file = os.path.join(output_path, f"{index + 1}_{state}.geojson")
                all_districts_gdf = gpd.GeoDataFrame(
                    final_results,
                    geometry="geometry",
                    crs="EPSG:4326"
                )
                
                try:
                    all_districts_gdf.to_file(district_file, driver="GeoJSON")
                    logging.info(f"Saved all districts for plan {index + 1} into file: {district_file}")
                    
                    with open(district_file, "r+") as f:
                        os.fsync(f.fileno())
                    
                except Exception as e:
                    logging.error(f"Failed to save file for plan {index + 1}: {e}")
                    
                logging.info(f"Plan Summary for plan {index + 1}: {plan_summary}")
                last_elements_summary = {key: value[-1] for key, value in plan_summary.items() if value}
                all_plan_summaries.append(last_elements_summary)

            except Exception as e:
                logging.error(f"Error processing task: {e}")
                
    try:
        all_plan_summaries_df = pd.DataFrame(all_plan_summaries)
        filepath = os.path.join(output_path, f"{state}_ensemble_summary.json")
        all_plan_summaries_df.to_json(filepath, orient="records")
        logging.info(f"Saved all plan summaries to {filepath}")
    except Exception as e:
        logging.error(f"Error combining or saving plan summaries: {e}")

if __name__ == "__main__":
    logging.info("Starting main process.")
    current_directory = os.getcwd()  
    california_data = "/california_precinct_merged.geojson"
    logging.info("Running seawulf function.")
    seawulf(current_directory, os.path.join(current_directory, ""), "CA", california_data, 5000, 52)
