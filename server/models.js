const mongoose = require("mongoose");
const sensorDataSchema = require("./schemas");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:6969/sensor_data');

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
// // Create a sample test data for the database
// const sensorData = new SensorData({
//     sensorId: "1",
//     temperature: 20,
//     humidity: 50,
//     gasConcentration: 100,
// });

// // Save the sample data to the database
// saveSensorData(sensorData);

// For averaging_values for database_entries
var average_temp = 0;
var average_humid = 0;
var average_gasCon = 0;

var average_counter = 0;


setInterval(() => {
    const sensor_data = [];
    // const sensor_entries = [];


    SENSORS.forEach(sensor => {
        if (sensor.timeout > 10) {
            sensor.send('disconnect');
            
            SENSORS.delete(sensor);
            console.log(`Removed unresponsive sensor ${sensor.id}`);

        } else {
            sensor_data.push({
                id: sensor.id,
                temperature: sensor.temperature,
                humidity: sensor.humidity,
                gasConcentration: sensor.gasConcentration
            });

            average_temp += sensor.temperature;
            average_humid += sensor.humidity;
            average_gasCon += sensor.gasConcentration;
            average_counter++;

            sensor.timeout++;           
        }

        // // Save sensor data to MongoDB example
        // var sensorData = new SensorData({
        //     sensorId: sensor.id,
        //     temperature: sensor.temperature,
        //     humidity: sensor.humidity,
        //     gasConcentration: sensor.gasConcentration
        // });

        // saveSensorData(sensorData);
    });

    USERS.forEach(user => {
        user.send(JSON.stringify(sensor_data));
    });

}, 1000);

// Save sensor data to MongoDB example
var sensorData = new SensorData({
    sensorId: 'test',
    temperature: average_temp / average_counter,
    humidity: average_humid / average_counter,
    gasConcentration: average_gasCon / average_counter
});

saveSensorData(sensorData);
