const express = require('express');

const app = express();
const appWs = require('express-ws')(app);

const PORT = process.env.PORT || 1337;

const SENSORS = new Set();
const USERS = new Set();

const mongoose = require('mongoose');

app.ws('/esp', ws => {
    SENSORS.add(ws);

    ws.send('Server response message. Connection to server verified');
    ws.timeout = 0;

    ws.id = -1;
    ws.temperature = 0;
    ws.humidity = 0;
    ws.gasConcentration = 0;
    
    ws.on('message', msg => {
        ws.timeout = 0;
        
        if (msg === "ping") {
            // console.log("Sensor ping: " + ws.id);
        } else {
            const parsed_msg = JSON.parse(msg);

            switch (parsed_msg["type"]) {
                case "id":
                    ws.id = parsed_msg["id"];

                    console.log(`New sensor ${ws.id} connected to server`);
                    break;

                case "data":
                    ws.temperature = parsed_msg["temperature"] || ws.temperature;
                    ws.humidity = parsed_msg["humidity"] || ws.humidity;
                    ws.gasConcentration = parsed_msg["gas_concentration"] || ws.gasConcentration;

                    // console.log("Sensor ESP ID: " + ws.id);
                    // console.log(`Temperature: ${ws.temperature}`);
                    // console.log(`Humidity: ${ws.humidity}\n\n`);
                    // console.log(`Gas Concentration: ${ws.gasConcentration}\n\n`);

                    break;
            
                default:
                    break;
            }
        }
    });

    ws.on('close', () => {
        SENSORS.delete(ws);
        console.log(`Sensor ${ws.id} disconnected from server`);
    });
});


app.ws('/browser', ws => {
    console.log("New browser connected");

    ws.id = Math.random().toString(36).substring(7);
    USERS.add(ws);

    ws.on('message', msg => {
        console.log(`Browser has sent message: ${msg}`);
    });

    ws.on('close', () => {
        console.log(`Browser disconnected`);
        USERS.delete(ws);
    });
});

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
}); 

app.listen(PORT, () => {
    console.log(`node: SERVER STARTED at port ${PORT}`);
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost/sensor_data', { useNewUrlParser: true });

// Define a schema for sensor data
const sensorDataSchema = new mongoose.Schema({
  sensorId: String,
  temperature: Number,
  humidity: Number,
  gasConcentration: Number,
  timestamp: { type: Date, default: Date.now }
});

// Create a model for sensor data
const SensorData = mongoose.model('SensorData', sensorDataSchema);


// To be modified to work for the saving the data
async function saveSensorData(sensorData) {
try {
    const data = await sensorData.save();
    console.log('Sensor data saved successfully!');
} catch (err) {
    console.error(err);
}
    }

// Create a sample test data for the database
const sensorData = new SensorData({
    sensorId: "1",
    temperature: 20,
    humidity: 50,
    gasConcentration: 100
});

// Save the sample data to the database
saveSensorData(sensorData);

setInterval(() => {
    const sensor_data = [];

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