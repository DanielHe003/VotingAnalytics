import os
import json

# Directories containing the data
data_directories = {
    'alabama': './data/alabama',
    'california': './data/california'
}

# Files to process
file_patterns = [
    '_precinct_merged.geojson',
    '_congressional_district_merged.geojson'
]

def convert_state_id(geojson_file):
    """Convert 'state_id' from string to integer in the GeoJSON file."""
    print(f"Processing file: {geojson_file}")
    try:
        with open(geojson_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        features = data.get('features', [])
        for feature in features:
            properties = feature.get('properties', {})
            state_id_str = properties.get('state_id', None)
            if state_id_str is not None:
                # Remove leading zeros and convert to integer
                state_id_int = int(state_id_str.lstrip('0'))
                properties['state_id'] = state_id_int
            else:
                print("Warning: 'state_id' not found in a feature's properties.")

        # Save the updated data back to the file
        with open(geojson_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        print(f"Successfully updated 'state_id' in {geojson_file}")
    except Exception as e:
        print(f"Error processing file {geojson_file}: {e}")

def main():
    for state, directory in data_directories.items():
        print(f"\nProcessing state: {state}")
        for filename in os.listdir(directory):
            if any(filename.endswith(pattern) for pattern in file_patterns):
                geojson_file = os.path.join(directory, filename)
                convert_state_id(geojson_file)

if __name__ == '__main__':
    main()
