from pymongo import MongoClient
from pymongo.errors import WriteError, OperationFailure
from bson import ObjectId

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "voter_analysis_project"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

def insert_document(collection, document, description):
    """Helper function to insert a document and print the outcome."""
    try:
        result = collection.insert_one(document)
        print(f"SUCCESS: {description}")
        print(f"Inserted document ID: {result.inserted_id}\n")
    except WriteError as e:
        print(f"FAILURE: {description}")
        print(f"WriteError: {e.details['errmsg']}\n")
    except OperationFailure as e:
        print(f"FAILURE: {description}")
        print(f"OperationFailure: {e.details['errmsg']}\n")
    except Exception as e:
        print(f"An unexpected error occurred during '{description}': {str(e)}\n")

def main():
    # Check collections exist and have documents
    for collection_name in ["merged_precincts", "merged_states", "merged_congressional_districts"]:
        collection = db[collection_name]
        doc_count = collection.count_documents({})
        print(f"{collection_name} contains {doc_count} documents.")

    # Use the 'merged_precincts' collection for testing
    collection_name = "merged_precincts"
    collection = db[collection_name]

    # Clear the collection before running tests (optional)
    collection.delete_many({})
    print(f"Cleared collection '{collection_name}' for testing.\n")

    # Valid document
    valid_precinct = {
        "type": "Feature",
        "properties": {
            "SRPREC_KEY": "0608710020",
            "PCT_DEM": 83.31658291457286,
            "PCT_REP": 16.683417085427134,
            "PRSDEM01": 2487,
            "PRSREP01": 498,
            "TOT_VOTES": 2985,
            "TOT_POP": 3825.0,
            "POP_HISLAT": 792.0,
            "POP_WHT": 2602.0,
            "POP_BLK": 45.0,
            "POP_AINDALK": 20.0,
            "POP_ASN": 122.0,
            "POP_HIPI": 11.0,
            "POP_OTH": 31.0,
            "POP_TWOMOR": 202.0,
            "CD_ID": 11,
            "TOT_HOUS21": 1589.0,
            "LESS_10K21": 60.0,
            "10K_15K21": 41.0,
            "15K_20K21": 62.0,
            "20K_25K21": 10.0,
            "25K_30K21": 9.0,
            "30K_35K21": 53.0,
            "35K_40K21": 17.0,
            "40K_45K21": 46.0,
            "45K_50K21": 33.0,
            "50K_60K21": 80.0,
            "60K_75K21": 69.0,
            "75K_100K21": 256.0,
            "100_125K21": 157.0,
            "125_150K21": 105.0,
            "150_200K21": 171.0,
            "200K_MOR21": 420.0,
            "MEDN_INC21": 112500.0
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-121.997426, 36.973501],
                    [-121.997424, 36.9735],
                    [-121.997384, 36.973466],
                    [-121.997426, 36.973501]  # Closing the polygon
                ]
            ]
        }
    }

    # Invalid document: Missing required field "SRPREC_KEY"
    missing_field_doc = {
        "type": "Feature",
        "properties": {
            # "SRPREC_KEY" is missing
            "PCT_DEM": 83.31658291457286,
            "MEDN_INC21": 112500.0
        },
        "geometry": valid_precinct["geometry"]
    }

    # Invalid document: Incorrect data type for "PCT_DEM"
    wrong_type_doc = {
        "type": "Feature",
        "properties": {
            "SRPREC_KEY": "0608710020",
            "PCT_DEM": "eighty-three percent",  # Invalid type
            "MEDN_INC21": 112500.0
        },
        "geometry": valid_precinct["geometry"]
    }

    # Invalid document: Additional unallowed field "EXTRA_FIELD"
    extra_field_doc = {
        "type": "Feature",
        "properties": {
            "SRPREC_KEY": "0608710020",
            "PCT_DEM": 83.31658291457286,
            "MEDN_INC21": 112500.0,
            "EXTRA_FIELD": "This field is not allowed"  # Unallowed field
        },
        "geometry": valid_precinct["geometry"]
    }

    # Insert valid document
    insert_document(collection, valid_precinct, "Inserting valid precinct")

    # Insert invalid document: Missing required field
    insert_document(collection, missing_field_doc, "Inserting precinct missing 'SRPREC_KEY'")

    # Insert invalid document: Incorrect data type
    insert_document(collection, wrong_type_doc, "Inserting precinct with incorrect 'PCT_DEM' type")

    # Insert invalid document: Additional unallowed field
    insert_document(collection, extra_field_doc, "Inserting precinct with unallowed 'EXTRA_FIELD'")

    # Check document count after tests
    doc_count = collection.count_documents({})
    print(f"{collection_name} contains {doc_count} documents after tests.")

if __name__ == "__main__":
    main()
