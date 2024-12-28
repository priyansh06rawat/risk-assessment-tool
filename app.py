# app.py
from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from mongo_utils import get_latest_model_metadata

app = Flask(__name__)

# Load the trained model
model = load_model('mnist_model.h5')

# Function to decode the image and preprocess it for prediction
def preprocess_image(image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    image = image.convert('L').resize((28, 28))
    image_array = np.array(image) / 255.0
    image_array = image_array.reshape(1, 28, 28)
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    # Get the base64-encoded image from the POST request
    data = request.get_json()
    image_data = data['image']

    # Preprocess the image
    image_array = preprocess_image(image_data)

    # Make a prediction
    predictions = model.predict(image_array)
    predicted_class = np.argmax(predictions, axis=1)

    # Return the predicted class
    return jsonify({'predicted_class': int(predicted_class[0])})

@app.route('/get_model_metadata', methods=['GET'])
def get_model_metadata():
    # Get the latest model metadata from MongoDB
    metadata = get_latest_model_metadata()

    if metadata:
        return jsonify(metadata)
    else:
        return jsonify({"message": "No metadata found."})

if __name__ == '__main__':
    app.run(debug=True)
