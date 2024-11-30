import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Read the CSV file and convert to a list of dictionaries
    with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        data = [row for row in csv_reader]
    
    # Write the data to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)


csv_to_json(r'database\California-data\california_income_gingles.csv', r'database\California-data\california_income_gingles.json')
csv_to_json(r'database\California-data\california_income_race_gingles.csv', r'database\California-data\california_income_race_gingles.json')
csv_to_json(r'database\California-data\california_income_rural_gingles.csv', r'database\California-data\california_income_rural_gingles.json')
csv_to_json(r'database\California-data\california_income_suburban_gingles.csv', r'database\California-data\california_income_suburban_gingles.json')
csv_to_json(r'database\California-data\california_income_urban_gingles.csv', r'database\California-data\california_income_urban_gingles.json')
csv_to_json(r'database\California-data\california_regular_gingles.csv', r'database\California-data\california_regular_gingles.json')
