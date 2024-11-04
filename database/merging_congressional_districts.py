import os
import geojson

# Paths to your two GeoJSON files with `os.path.expanduser` to handle `~` in paths
file1_path = os.path.expanduser('~/downloads/congressional_district_voting_demographic.geojson')
file2_path = os.path.expanduser('~/downloads/congressional_district_income.geojson')
output_file = './merged_congressional_districts.geojson'

# Load the first GeoJSON file
with open(file1_path) as f:
    district_voting = geojson.load(f)

# Load the second GeoJSON file
with open(file2_path) as f:
    district_income = geojson.load(f)

# Initialize the merged GeoJSON structure
merged_features = []

# Create a dictionary for fast lookup based on the "ID" field
voting_features = {feature['properties']['ID']: feature for feature in district_voting['features']}
income_features = {feature['properties']['ID']: feature for feature in district_income['features']}

# Merge the features by combining properties and reusing the same geometry
for id, voting_feature in voting_features.items():
    if id in income_features:
        merged_feature = {
            "type": "Feature",
            "properties": {**voting_feature['properties'], **income_features[id]['properties']},
            "geometry": voting_feature['geometry']  # Assuming geometry is identical
        }
        merged_features.append(merged_feature)

# Define the merged GeoJSON structure
merged_geojson = {
    "type": "FeatureCollection",
    "name": "merged_congressional_districts",
    "crs": district_voting["crs"],  # Assuming both files have the same CRS
    "features": merged_features
}

# Save the merged GeoJSON to a new file
with open(output_file, 'w') as f:
    geojson.dump(merged_geojson, f, indent=2)

print(f"Merged file created: {output_file}")
