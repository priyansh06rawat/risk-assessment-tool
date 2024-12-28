# mongo_utils.py
from pymongo import MongoClient
import random
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ml_project']
collection = db['model_metadata']

# Save model metadata to MongoDB
def save_model_metadata(metadata):
    collection.insert_one(metadata)
    print("Model metadata saved.")

# Fetch the latest model metadata
def get_latest_model_metadata():
    return collection.find_one(sort=[('date', -1)])

# Insert random data into MongoDB
def insert_random_data():
    for _ in range(10):
        random_data = {
            'name': f'Item {random.randint(1, 1000)}',
            'value': random.uniform(1, 100),
            'timestamp': int(datetime.timestamp(datetime.now()))
        }
        collection.insert_one(random_data)
    print("Random data inserted.")

# Update a document in MongoDB
def update_random_data():
    item = collection.find_one()
    if item:
        collection.update_one({'_id': item['_id']}, {'$set': {'value': random.uniform(1, 100)}})
        print(f"Updated item: {item['_id']}")

# Delete a document in MongoDB
def delete_random_data():
    item = collection.find_one()
    if item:
        collection.delete_one({'_id': item['_id']})
        print(f"Deleted item: {item['_id']}")
