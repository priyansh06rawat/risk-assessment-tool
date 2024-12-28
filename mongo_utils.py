from pymongo import MongoClient
import json

# Connect to MongoDB (assume it's running locally on default port)
client = MongoClient('mongodb://localhost:27017/')
db = client['ml_project']
collection = db['model_metadata']

# Function to insert model metadata into MongoDB
def save_model_metadata(metadata):
    collection.insert_one(metadata)
    print("Model metadata saved.")

# Fetch the latest model metadata
def get_latest_model_metadata():
    return collection.find_one(sort=[('date', -1)])  # Assuming you store date as well

