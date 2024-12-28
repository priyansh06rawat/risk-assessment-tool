# model_training.py
import tensorflow as tf
from mongo_utils import save_model_metadata
import datetime
import numpy as np
from sklearn.preprocessing import StandardScaler

# Generate random data with scaling
def generate_random_data(samples=1000, features=30):
    X = np.random.rand(samples, features)  # Random features
    y = np.random.randint(0, 2, samples)   # Random binary labels
    return X, y

# Scale data using StandardScaler
def preprocess_data(X_train, X_test):
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled

# Build a more complex neural network model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(30,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Generate random data for training and testing
X_train, y_train = generate_random_data(1000, 30)
X_test, y_test = generate_random_data(200, 30)

# Preprocess data
X_train, X_test = preprocess_data(X_train, X_test)

# Train the model
model.fit(X_train, y_train, epochs=5)

# Evaluate the model
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc}")

# Save the model
model.save('mnist_model.h5')

# Save metadata to MongoDB
metadata = {
    "model_name": "Random Data Classifier v2",
    "accuracy": test_acc,
    "epochs": 5,
    "date": datetime.datetime.utcnow(),
    "model_file": "mnist_model.h5"
}
save_model_metadata(metadata)
