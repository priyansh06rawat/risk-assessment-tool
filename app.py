# app.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from mongo_utils import get_latest_model_metadata, insert_random_data, update_random_data, delete_random_data
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the trained model
model = tf.keras.models.load_model('mnist_model.h5')

# Preprocess image (base64 to numpy array)
def preprocess_image(image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    image = image.convert('L').resize((28, 28))
    image_array = np.array(image) / 255.0
    image_array = image_array.reshape(1, 28, 28)
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = data['image']
        
        # Preprocess and predict
        image_array = preprocess_image(image_data)
        predictions = model.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1)
        
        logging.info(f"Prediction made: {predicted_class[0]}")
        return jsonify({'predicted_class': int(predicted_class[0])})
    except Exception as e:
        logging.error(f"Error in /predict endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_model_metadata', methods=['GET'])
def get_model_metadata():
    try:
        metadata = get_latest_model_metadata()
        if metadata:
            return jsonify(metadata)
        else:
            return jsonify({"message": "No metadata found."})
    except Exception as e:
        logging.error(f"Error in /get_model_metadata endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/insert_random_data', methods=['POST'])
def insert_data():
    try:
        insert_random_data()
        return jsonify({"message": "Random data inserted into MongoDB"})
    except Exception as e:
        logging.error(f"Error in /insert_random_data endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_random_data', methods=['POST'])
def update_data():
    try:
        update_random_data()
        return jsonify({"message": "Random data updated in MongoDB"})
    except Exception as e:
        logging.error(f"Error in /update_random_data endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete_random_data', methods=['POST'])
def delete_data():
    try:
        delete_random_data()
        return jsonify({"message": "Random data deleted from MongoDB"})
    except Exception as e:
        logging.error(f"Error in /delete_random_data endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
