import os
import geojson
import json

# Paths to your two GeoJSON files
file1_path = os.path.expanduser('~/downloads/state_income.geojson')
file2_path = os.path.expanduser('~/downloads/state_voting_demographic.geojson')
output_file = './merged_states.geojson'

# Load the first GeoJSON file
with open(file1_path) as f:
    state_income = geojson.load(f)

# Load the second GeoJSON file
with open(file2_path) as f:
    state_voting = geojson.load(f)

# Initialize the merged GeoJSON structure
merged_features = []

# Create a dictionary for fast lookup based on a unique key (in this case, "NAME")
income_features = {feature['properties']['NAME']: feature for feature in state_income['features']}
voting_features = {feature['properties']['NAME']: feature for feature in state_voting['features']}

# Merge the features by combining properties and reusing the same geometry
for name, income_feature in income_features.items():
    if name in voting_features:
        merged_feature = {
            "type": "Feature",
            "properties": {**income_feature['properties'], **voting_features[name]['properties']},
            "geometry": income_feature['geometry']  # Assuming geometry is identical
        }
        merged_features.append(merged_feature)

# Define the merged GeoJSON structure
merged_geojson = {
    "type": "FeatureCollection",
    "name": "merged_state",
    "crs": state_income["crs"],  # Assuming both files have the same CRS
    "features": merged_features
}

# Save the merged GeoJSON to a new file
with open(output_file, 'w') as f:
    geojson.dump(merged_geojson, f, indent=2)

print(f"Merged file created: {output_file}")
