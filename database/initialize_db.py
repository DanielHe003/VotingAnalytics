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
def import_cd_representatives(state_id, data_directory,state):
    """Import Congressional District Representatives data for a specific state."""
    cd_representative_file = os.path.join(data_directory, "cd-representative", f"{state}_cd_representatives.json")
    if not os.path.exists(cd_representative_file):
        print(f"Representative data file not found for state id {state_id}. Skipping.")
        return

    print(f"Importing {cd_representative_file} for state {state_id}")
    with open(cd_representative_file, 'r') as f:
        data_list = json.load(f)

    # Add stateId to each document
    for item in data_list:
        item["stateId"] = state_id

    try:
        db.cd_representatives.insert_many(data_list)
        print(f"Inserted {len(data_list)} documents for {cd_representative_file}")
    except BulkWriteError as bwe:
        print(f"Bulk write error for {cd_representative_file}: {bwe.details}")
        
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
