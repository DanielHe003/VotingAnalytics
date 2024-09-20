import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
import pandas as pd
import numpy as np

# Define the file paths
file1 = "data\preprocessing\AL-Data\precinct-voting.json"
file2 = "C:\Users\danie\voter_analysis_project\data\preprocessing\AL-Data\income.json"
file3 = "data\preprocessing\AL-Data\race.json"

# Read the GeoJSON files into GeoDataFrames
gdf1 = gpd.read_file(file1)
gdf2 = gpd.read_file(file2)
gdf3 = gpd.read_file(file3)

# Ensure all GeoDataFrames have the same CRS
crs = "EPSG:4326"
gdf1 = gdf1.to_crs(crs)
gdf2 = gdf2.to_crs(crs)
gdf3 = gdf3.to_crs(crs)

# Combine all GeoDataFrames into one
combined_gdf = gpd.GeoDataFrame(pd.concat([gdf1, gdf2, gdf3], ignore_index=True))

# Function to average attributes and merge geometries
def average_attributes(geometries):
    numeric_columns = geometries.select_dtypes(include=[np.number]).columns
    avg_attributes = geometries[numeric_columns].mean()
    merged_geometry = unary_union(geometries.geometry)
    return avg_attributes, merged_geometry

# Create an empty GeoDataFrame to store the results
result_gdf = gpd.GeoDataFrame(columns=combined_gdf.columns)

# Spatial join to identify overlapping geometries
joined = gpd.sjoin(combined_gdf, combined_gdf, how="inner", op='intersects')

# Group by the index of the original GeoDataFrame
for idx, group in joined.groupby(joined.index):
    overlapping = combined_gdf.loc[group.index_right]
    if not overlapping.empty:
        avg_attributes, merged_geometry = average_attributes(overlapping)
        new_row = {col: avg_attributes[col] if col in avg_attributes else overlapping[col].iloc[0] for col in combined_gdf.columns}
        new_row['geometry'] = merged_geometry
        result_gdf = result_gdf.append(new_row, ignore_index=True)

# Save the result to a new GeoJSON file
output_file = "/path/to/your/combined.geojson"
result_gdf.to_file(output_file, driver="GeoJSON")

print(f"Combined GeoJSON file saved to {output_file}")
