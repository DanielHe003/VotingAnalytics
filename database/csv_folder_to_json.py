import os
import csv
import json

def convert_csv_folder_to_json(input_folder, output_folder):
    """
    Convert all CSV files in a folder to JSON and save them to an output folder.

    Args:
        input_folder (str): Path to the folder containing CSV files.
        output_folder (str): Path to the folder where JSON files will be saved.
    """
    try:
        # Ensure the output folder exists
        os.makedirs(output_folder, exist_ok=True)

        # Iterate through all files in the input folder
        for filename in os.listdir(input_folder):
            if filename.endswith('.csv'):  # Process only CSV files
                csv_file_path = os.path.join(input_folder, filename)
                json_file_name = os.path.splitext(filename)[0] + '.json'
                json_file_path = os.path.join(output_folder, json_file_name)

                # Convert the CSV to JSON
                with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
                    csv_reader = csv.DictReader(csv_file)
                    data = [row for row in csv_reader]

                # Save the JSON data
                with open(json_file_path, mode='w', encoding='utf-8') as json_file:
                    json.dump(data, json_file, indent=4)

                print(f"Converted {filename} to {json_file_name}")

        print(f"All CSV files in {input_folder} have been converted and saved to {output_folder}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    input_folder = input("Enter the path to the folder containing CSV files: ")
    output_folder = input("Enter the path to the folder where JSON files should be saved: ")
    convert_csv_folder_to_json(input_folder, output_folder)
