const mongoose = require("mongoose");
const sensorDataSchema = require("schemas");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/sensor_data", { useNewUrlParser: true });

// Create a model for sensor data
const SensorData = mongoose.model("SensorData", sensorDataSchema);

// To be modified to work for the saving the data
async function saveSensorData(sensorData) {
    try {
        const data = await sensorData.save();
        console.log("Sensor data saved successfully!");
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    SensorData,
    saveSensorData
}