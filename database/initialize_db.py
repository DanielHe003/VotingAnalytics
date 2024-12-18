import os
import json
import pymongo
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
import re

# MongoDB connection details
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "voter_analysis_project"

# Define folder structure for states
data_directories = {
    'alabama': './data/alabama',
    'california': './data/california'
}

# File paths
schema_dir = './schemas'
file_mappings = {
    'congressional_district_merged.geojson': 'congressional_districts',
    'precinct_merged.geojson': 'precincts',
    'state_merged.geojson': 'states'
}

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

def clear_database():
    """Clear all collections in the database."""
    collections = db.list_collection_names()
    for collection in collections:
        db[collection].drop()
    print("Database cleared.")

def load_schema(schema_file):
    """Load JSON schema from file."""
    with open(schema_file, 'r') as f:
        return json.load(f)

def create_collection_with_schema(collection_name, schema):
    """Create collection with schema validation directly."""
    try:
        db.create_collection(
            collection_name,
            validator=schema.get('validator'),
            validationLevel=schema.get('validationLevel', 'strict'),
            validationAction="error"
        )
        print(f"Collection {collection_name} created with schema.")
    except pymongo.errors.CollectionInvalid:
        print(f"Collection {collection_name} already exists.")
    except Exception as e:
        print(f"Error creating collection {collection_name}: {e}")

def import_geojson(collection_name, geojson_file):
    """Import GeoJSON data into a MongoDB collection with detailed error logging."""
    with open(geojson_file, 'r') as f:
        data = json.load(f)

    # Extract features from the GeoJSON
    features = data.get('features', [])
    if features:
        for feature in features:
            try:
                # Attempt to insert each document individually
                db[collection_name].insert_one(feature)
            except BulkWriteError as bwe:
                print("Bulk write error occurred.")
                for error in bwe.details['writeErrors']:
                    print(f"Error inserting document: {error['errmsg']}")
            except pymongo.errors.WriteError as we:
                print("Validation failed for document:")
                print(json.dumps(feature, indent=2))  # Print the document that failed
                print(f"Error: {we.details['errmsg']}")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                
def import_gingles_data(stateId, data_directory):
    """Import Gingles analysis data for a specific state."""
    gingles_dir = os.path.join(data_directory, 'gingles-analysis')
    if not os.path.exists(gingles_dir):
        print(f"Gingles analysis directory not found for state id {stateId}. Skipping.")
        return

    # List all JSON files in the gingles-analysis directory
    for file_name in os.listdir(gingles_dir):
        if file_name.endswith('.json'):
            file_path = os.path.join(gingles_dir, file_name)
            import_single_gingles_file(stateId, file_path)

def import_single_gingles_file(stateId, file_path):
    """Import a single Gingles analysis JSON file."""
    file_name = os.path.basename(file_path)
    print(f"Importing {file_name} for state {stateId}")

    # Determine analysis_type and region_type from the file name
    analysis_type, region_type = parse_gingles_file_name(file_name)

    with open(file_path, 'r') as f:
        data_list = json.load(f)

    documents = []
    for item in data_list:
        document = {
            "stateId": stateId,
            "precinct_key": item.get("Precinct_key"),
            "analysis_type": analysis_type,
            "region_type": region_type,
            "data": item
        }
        documents.append(document)

    if documents:
        try:
            db.gingles_analysis.insert_many(documents)
            print(f"Inserted {len(documents)} documents for {file_name}")
        except BulkWriteError as bwe:
            print(f"Bulk write error for {file_name}: {bwe.details}")

def parse_gingles_file_name(file_name):
    """Extract analysis_type and region_type from the file name."""
    # Remove state prefix and file extension
    base_name = re.sub(r'^(alabama|california)_', '', file_name)
    base_name = base_name.replace('.json', '')

    # Initialize analysis_type and region_type
    analysis_type = None
    region_type = None

    if 'income_race_gingles' in base_name:
        analysis_type = 'income_race'
    elif 'income_gingles' in base_name:
        analysis_type = 'income'
    elif 'regular_gingles' in base_name:
        analysis_type = 'regular'

    if 'suburban' in base_name:
        region_type = 'suburban'
    elif 'urban' in base_name:
        region_type = 'urban'
    elif 'rural' in base_name:
        region_type = 'rural'

    return analysis_type, region_type
def import_ei_analysis_data(state_id, data_directory, state_name):
    ei_analysis_dir = os.path.join(data_directory, 'ei-analysis-json')
    if not os.path.exists(ei_analysis_dir):
        print(f"EI analysis directory not found for state id {state_id}. Skipping.")
        return

    analysis_types = ['economic', 'race', 'region']
    region_types = ['rural', 'suburban', 'urban']

    for analysis_type in analysis_types:
        analysis_subdir = os.path.join(ei_analysis_dir, analysis_type)
        if not os.path.exists(analysis_subdir):
            print(f"No data for {analysis_type} analysis in {state_name}. Skipping.")
            continue

        # First, import top-level files with region_type = None
        for file_name in os.listdir(analysis_subdir):
            file_path = os.path.join(analysis_subdir, file_name)
            if file_name.endswith('.json') and os.path.isfile(file_path):
                candidate_name = extract_candidate_name(file_name)
                import_single_ei_analysis_file(state_id, file_path, analysis_type, candidate_name, region_type=None)

        # Then, check for region_type directories
        for rt in region_types:
            rt_dir = os.path.join(analysis_subdir, rt)
            if os.path.exists(rt_dir) and os.path.isdir(rt_dir):
                for file_name in os.listdir(rt_dir):
                    if file_name.endswith('.json'):
                        file_path = os.path.join(rt_dir, file_name)
                        candidate_name = extract_candidate_name(file_name)
                        import_single_ei_analysis_file(state_id, file_path, analysis_type, candidate_name, region_type=rt)

def import_single_ei_analysis_file(state_id, file_path, analysis_type, candidate_name, region_type=None):
    file_name = os.path.basename(file_path)
    print(f"Importing {file_name} ({analysis_type}) for candidate {candidate_name} in state {state_id} with region_type={region_type}")

    with open(file_path, 'r') as f:
        data = json.load(f)

    document = {
        "stateId": state_id,
        "analysisType": analysis_type,
        "candidateName": candidate_name,
        "fileName": file_name,
        "region_type": region_type,
        "data": data
    }

    try:
        db.ei_analysis.insert_one(document)
        print(f"Inserted {file_name} for {analysis_type} analysis for candidate {candidate_name}.")
    except BulkWriteError as bwe:
        print(f"Bulk write error for {file_name}: {bwe.details}")
    except Exception as e:
        print(f"Error inserting {file_name}: {e}")

def extract_candidate_name(file_name):
    """
    Extract the candidate's name from the file name.
    
    Args:
        file_name (str): The name of the file.
    
    Returns:
        str: The extracted candidate name.
    """
    if "biden" in file_name.lower():
        return "Biden"
    elif "trump" in file_name.lower():
        return "Trump"
    else:
        return "Unknown"
def import_cd_representatives(state_id, data_directory,state):
    """Import Congressional District Representatives data for a specific state."""
    cd_representative_file = os.path.join(data_directory, "cd-representative", f"{state}_cd_representatives.json")
    if not os.path.exists(cd_representative_file):
        print(f"Representative data file not found for state id {state_id}. Skipping.")
        return

    print(f"Importing {cd_representative_file} for state {state_id}")
    with open(cd_representative_file, 'r') as f:
        data_list = json.load(f)

    try:
        db.cd_representatives.insert_many(data_list)
        print(f"Inserted {len(data_list)} documents for {cd_representative_file}")
    except BulkWriteError as bwe:
        print(f"Bulk write error for {cd_representative_file}: {bwe.details}")
def simplify_group_name(raw_name):
    """
    Simplify the group name by removing '_pct' if present.
    E.g. 'asian_pct' -> 'asian'
         'black_pct' -> 'black'
         'rural_population_pct' -> 'rural_population' or possibly just 'rural'?
    
    For region, you might have something like 'rural_population_pct'.
    Decide how to simplify. For consistency, remove '_pct' only.
    If needed, also remove '_population' if you want it even simpler.
    """

    # Remove '_pct' at the end if present
    if raw_name.endswith('_pct'):
        raw_name = raw_name[:-4]  # remove '_pct'

    # If you want to also remove '_population', do it here:
    # if '_population' in raw_name:
    #    raw_name = raw_name.replace('_population', '')

    return raw_name

        
def import_box_whisker_data(state_id, data_directory, state_name):
    """Import Box & Whisker data for a specific state."""
    bw_dir = os.path.join(data_directory, 'box-whisker-json')
    if not os.path.exists(bw_dir):
        print(f"Box & Whisker directory not found for state id {state_id}. Skipping.")
        return

    # Map directories to analysis types and the key we look for
    # race -> use "race"
    # income -> "economic" analysis type, use "economic_group"
    # region -> use "region"
    analysis_map = {
        'race': ('race', 'race'),
        'income': ('economic', 'economic_group'),
        'region': ('region', 'region')
    }

    for analysis_folder, (analysis_type, key_field) in analysis_map.items():
        analysis_subdir = os.path.join(bw_dir, analysis_folder)
        if not os.path.exists(analysis_subdir):
            print(f"No {analysis_folder} data for {state_name}. Skipping.")
            continue

        # For each JSON file in this folder
        for file_name in os.listdir(analysis_subdir):
            if file_name.endswith('.json'):
                file_path = os.path.join(analysis_subdir, file_name)
                print(f"Importing Box & Whisker: {file_name} (analysis: {analysis_type}) for state {state_id}")

                with open(file_path, 'r') as f:
                    data_list = json.load(f)

                if not data_list:
                    print(f"No data in {file_name}, skipping.")
                    continue

                # Extract the groupName from the first entry
                first_entry = data_list[0]
                if key_field not in first_entry:
                    print(f"Warning: '{key_field}' not found in {file_name}, skipping.")
                    continue

                raw_group_name = first_entry[key_field]
                group_name = simplify_group_name(raw_group_name)

                # Insert the entire data_list as 'data' field
                document = {
                    "stateId": state_id,
                    "analysisType": analysis_type,
                    "groupName": group_name,
                    "data": data_list
                }

                try:
                    db.box_whisker_data.insert_one(document)
                    print(f"Inserted box & whisker data for {file_name} with groupName={group_name}")
                except BulkWriteError as bwe:
                    print(f"Bulk write error for {file_name}: {bwe.details}")
                except Exception as e:
                    print(f"Error inserting {file_name}: {e}")

def import_district_plans(state_id, data_directory, state_name):
    """Import district plans for GUI-11 comparison."""
    dp_dir = os.path.join(data_directory, 'district-plans')
    if not os.path.exists(dp_dir):
        print(f"District plans directory not found for state id {state_id}. Skipping.")
        return

    # Map directories to a naming scheme
    # We'll assume directories like enacted, heavily-rural, max-income-deviation, min-income-deviation
    # We'll create a friendly name pattern based on count and directory
    category_map = {
        'enacted': ('enacted', 'Current Plan'),
        'heavily-rural': ('heavilyRural', 'Heavily Rural'),
        'max-income-deviation': ('maxIncomeDeviation', 'Max Income Deviation'),
        'min-income-deviation': ('minIncomeDeviation', 'Min Income Deviation'),
        'heavily-suburban': ('heavilySuburban', 'Heavily Suburban'),
        'heavily-urban': ('heavilyUrban', 'Heavily Urban')
    }

    # This may vary by state; if directories don't exist, skip them
    for category_folder in os.listdir(dp_dir):
        category_path = os.path.join(dp_dir, category_folder)
        if not os.path.isdir(category_path):
            continue

        if category_folder not in category_map:
            print(f"Unknown category {category_folder}, skipping.")
            continue

        base_id, base_name = category_map[category_folder]
        index = 1

        for file_name in os.listdir(category_path):
            if file_name.endswith('.geojson'):
                file_path = os.path.join(category_path, file_name)
                print(f"Importing district plan: {file_name} from {category_folder} for state {state_id}")

                with open(file_path, 'r') as f:
                    data = json.load(f)

                # Extract plan_num from name in the properties of first feature or from file_name
                # The geojson has "plan_num" in properties of each feature.
                # We'll just read the first feature to get plan_num
                features = data.get('features', [])
                if not features:
                    print(f"No features in {file_name}, skipping.")
                    continue

                first_feature = features[0]
                properties = first_feature.get('properties', {})
                plan_num = properties.get('plan_num', None)

                # Determine ID and name for this plan
                # For enacted, just use 'enacted' and 'Current Plan'
                # For others, we append a number to base_id and base_name
                if base_id == 'enacted':
                    plan_id = 'enacted'
                    plan_name = base_name
                else:
                    plan_id = f"{base_id}{index}"
                    plan_name = f"{base_name} {index}"
                    index += 1

                document = {
                    "stateId": state_id,
                    "category": category_folder,
                    "planNum": plan_num,
                    "id": plan_id,
                    "name": plan_name,
                    "geojson": data  # store entire geojson
                }

                try:
                    db.district_plans.insert_one(document)
                    print(f"Inserted district plan {plan_id} ({plan_name}) for {file_name}")
                except BulkWriteError as bwe:
                    print(f"Bulk write error for {file_name}: {bwe.details}")
                except Exception as e:
                    print(f"Error inserting {file_name}: {e}")

        
def initialize_state_data(state, data_directory):
    """Initialize data for a specific state."""
    print(f"Loading data for state: {state}")
    state_id = 1 if state == "alabama" else 6
    for file_suffix, collection_name in file_mappings.items():
        geojson_file = os.path.normpath(os.path.join('./', data_directory, f"{state}_{file_suffix}"))
        schema_file = os.path.normpath(os.path.join('./', schema_dir, f"{collection_name}.json"))

        # Apply schema if it exists
        if os.path.exists(schema_file):
            print(f"Applying schema for {collection_name}...")
            schema = load_schema(schema_file)
            create_collection_with_schema(collection_name, schema)

        # Import data
        if os.path.exists(geojson_file):
            print(f"Importing {geojson_file} into {collection_name} collection...")
            import_geojson(collection_name, geojson_file)
        else:
            print(f"File {geojson_file} not found. Skipping.")
    import_gingles_data(state_id, data_directory)
    import_cd_representatives(state_id, data_directory,state)
    import_ei_analysis_data(state_id, data_directory, state)
    import_box_whisker_data(state_id, data_directory, state)
    import_district_plans(state_id, data_directory, state)

def initialize_db():
    """Initialize database: clear, load data, and then apply schemas."""
    # Clear existing collections
    clear_database()

    # Process data for each state in order: Alabama first, then California
    for state, directory in data_directories.items():
        initialize_state_data(state, directory)

if __name__ == "__main__":
    initialize_db()
    print("Database initialization complete.")
