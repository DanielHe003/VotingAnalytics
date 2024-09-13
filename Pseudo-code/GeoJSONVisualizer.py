# Import the necessary libraries
# Make sure to do pip install geopandas to install them on your local machines
import geopandas as gpd
import matplotlib.pyplot as plt

# Define a function to visualize GeoJSON data
def visualize_geojson(geojson_file_path):
    # Step 1: Read the GeoJSON file, or if we get a csv file or anything else, we'll have to adjust it over
    gdf = gpd.read_file(geojson_file_path)
    
    # Step 2: Plot the GeoDataFrame
    fig, ax = plt.subplots(figsize=(10, 10))
    gdf.plot(ax=ax, color='blue', edgecolor='black')
    
    # Step 3: Customize the plot (optional)
    ax.set_title('GeoJSON Visualization')
    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    
    # Step 4: Display the plot
    plt.show()

# Example usage
visualize_geojson('path_to_your_geojson_file.geojson')