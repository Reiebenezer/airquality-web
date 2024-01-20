const path = require('path');
const express = require('express');

const app = express();
const appWs = require('express-ws')(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client'));
app.use(express.static('client'));

const PORT = process.env.PORT || 1337;

const SENSORS = new Set();
const USERS = new Set();

app.ws('/esp', ws => {
    SENSORS.add(ws);

    ws.send('Server response message. Connection to server verified');
    ws.timeout = 0;

    ws.id = -1;

    ws.data = {
        temperature: 0,
        humidity: 0,
        ozone: 0,
        carbonMonoxide: 0
    };

    ws.gasConcentration = 0;
    
    ws.on('message', msg => {
        
        if (msg === "ping") {
            ws.timeout = 0;
            
        } else {
            const parsed_msg = JSON.parse(msg);

            switch (parsed_msg["type"]) {
                case "id":
                    ws.id = parsed_msg["id"];

                    console.log(`New sensor ${ws.id} connected to server`);
                    break;

                case "data":
                    ws.gasConcentration = parsed_msg["gas_concentration"] || ws.gasConcentration;

                    ws.data.temperature     = parsed_msg["temperature"]     || ws.data.temperature;
                    ws.data.humidity        = parsed_msg["humidity"]        || ws.data.humidity;
                    ws.data.ozone           = parsed_msg["ozone"]           || ws.data.ozone;
                    ws.data.carbonMonoxide  = parsed_msg["carbon_monoxide"] || ws.data.carbonMonoxide;

                    // Insert new row in database
                    
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
    USERS.add(ws);

    ws.on('message', msg => {
        console.log(`Browser has sent message: ${msg}`);
    });

    ws.on('close', () => {
        console.log(`Browser disconnected`);
        USERS.delete(ws);
    });
});


app.get('/', (req, res) => {
    res.render("index", { ip: 'ws://192.168.3.156:1337' });
});

app.get('/db', (req, res) => {
    res.sendFile(path.join(__dirname, "client/db.html"));
})

app.listen(PORT, () => {
    console.log(`node: SERVER STARTED at port ${PORT}`);
});

setInterval(() => {
    const sensor_data = [];

    SENSORS.forEach(sensor => {
        if (sensor.timeout > 10) {
            sensor.send('disconnect');
            
            SENSORS.delete(sensor);
            console.log(`Removed unresponsive sensor ${sensor.id}`);

        } else {
            sensor_data.push(sensor.data);
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