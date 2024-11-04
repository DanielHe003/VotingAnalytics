from pymongo import MongoClient

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "voter_analysis_project"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Check collections exist and have documents
for collection_name in ["merged_precincts", "merged_states", "merged_congressional_districts"]:
    collection = db[collection_name]
    doc_count = collection.count_documents({})
    print(f"{collection_name} contains {doc_count} documents.")

    # Attempt to insert an invalid document to test schema validation
    try:
        collection.insert_one({"type": "Feature", "properties": {}})
        print(f"Schema validation failed for {collection_name} (invalid document inserted)")
    except Exception as e:
        print(f"Schema validation works for {collection_name} (error: {e})")
