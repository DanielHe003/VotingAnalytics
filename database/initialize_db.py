import os
import json
import pymongo
from pymongo import MongoClient
from pymongo.errors import BulkWriteError

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

def initialize_state_data(state, data_directory):
    """Initialize data for a specific state."""
    print(f"Loading data for state: {state}")
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
