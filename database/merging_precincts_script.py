import json
import os

# Define file paths
voting_data_path = os.path.expanduser('~/downloads/precinct_voting_demographic.geojson')
income_data_path = os.path.expanduser('~/downloads/precinct_income.geojson')
output_path = './merged_precincts.geojson'  # Save output in current directory

# Load the two GeoJSON files
with open(voting_data_path) as f1:
    voting_data = json.load(f1)

with open(income_data_path) as f2:
    income_data = json.load(f2)

# Create a dictionary to store features by SRPREC_KEY for faster lookup
income_features_dict = {feature['properties']['SRPREC_KEY']: feature for feature in income_data['features']}

# Merge features
merged_features = []
for voting_feature in voting_data['features']:
    srprec_key = voting_feature['properties']['SRPREC_KEY']
    
    # Find matching income feature by SRPREC_KEY
    income_feature = income_features_dict.get(srprec_key)
    if income_feature:
        # Combine properties
        combined_properties = {**voting_feature['properties'], **income_feature['properties']}
        
        # Add the merged feature with combined properties and geometry from the voting feature
        merged_features.append({
            "type": "Feature",
            "properties": combined_properties,
            "geometry": voting_feature['geometry']
        })

# Prepare merged GeoJSON
merged_geojson = {
    "type": "FeatureCollection",
    "name": "merged_precincts",
    "crs": voting_data["crs"],
    "features": merged_features
}

# Save the merged GeoJSON to a new file
with open(output_path, 'w') as outfile:
    json.dump(merged_geojson, outfile, indent=2)

print(f"Merged GeoJSON saved as {output_path}")
