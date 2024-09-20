import geojson
import os

def load_geojson(file_path):
    with open(file_path, 'r') as file:
        return geojson.load(file)

def combine_geojson(files):
    features = []
    for file in files:
        data = load_geojson(file)
        if data['type'] == 'FeatureCollection':
            features.extend(data['features'])
        elif data['type'] == 'Feature':
            features.append(data)
        else:
            raise ValueError(f"Unsupported GeoJSON type: {data['type']}")
    
    combined = geojson.FeatureCollection(features)
    return combined

def save_geojson(data, output_file):
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w') as file:
        geojson.dump(data, file)

# List of JSON files containing GeoJSON data to combine
geojson_files = [
    r'C:\Users\danie\voter_analysis_project\data\preprocessing\AL-Data\al_gen_20_st_prec.json', 
    r'C:\Users\danie\voter_analysis_project\data\preprocessing\AL-Data\al_inc_2018_to_2022_income.json'
]

# Combine the GeoJSON files
combined_geojson = combine_geojson(geojson_files)

# Save the combined GeoJSON to a new file
output_file = r'data\preprocessing\AL-Data\combined_alabama.geojson'
save_geojson(combined_geojson, output_file)