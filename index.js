const path = require("path");
const express = require("express");

const app = express();
const appWs = require("express-ws")(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "client"));
app.use(express.static("client"));

const PORT = process.env.PORT || 1337;
// const ip = '192.168.43.119';
// const ip = '192.168.3.156';
const ip = "192.168.4.3";

const SENSORS = new Set();
const USERS = new Set();

app.ws("/esp", (ws) => {
    SENSORS.add(ws);

    ws.send("Server response message. Connection to server verified");
    ws.timeout = 0;

    ws.id = -1;

    ws.data = {
        temperature: 0,
        humidity: 0,
        ozone: 0,
        carbonMonoxide: 0,
    };

    ws.averageData = {
        temperature: 0,
        humidity: 0,
        ozone: 0,
        carbonMonoxide: 0,
    };

    ws.gasConcentration = 0;
    ws.averageCounter = 1;

    ws.on("message", (msg) => {
        ws.timeout = 0;

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
                    ws.gasConcentration =
                        +parsed_msg["gas_concentration"] || ws.gasConcentration;

                    ws.data.temperature =
                        +parsed_msg["temperature"] || ws.data.temperature;
                    
                    ws.data.humidity =
                        +parsed_msg["humidity"] || ws.data.humidity;
                    
                    ws.data.ozone = 
                        +parsed_msg["ozone"] || ws.data.ozone;
                    
                    ws.data.carbonMonoxide =
                        +parsed_msg["carbon_monoxide"] || ws.data.carbonMonoxide;

                    // Insert new row in database
                    // console.log(ws.data);

                    break;

                default:
                    break;
            }
        }
    });

    ws.on("close", () => {
        SENSORS.delete(ws);
        console.log(`Sensor ${ws.id} disconnected from server`);
    });
});

app.ws("/browser", (ws) => {
    console.log("New browser connected");
    USERS.add(ws);

    ws.on("message", (msg) => {
        console.log(`Browser has sent message: ${msg}`);

        if (msg === "disconnect-all") {
            console.log("Disconnecting all sensors...");
            SENSORS.forEach((sensor) => {
                sensor.send("disconnect");
            });
        }
    });

    ws.on("close", () => {
        console.log(`Browser disconnected`);
        USERS.delete(ws);
    });
});

app.get("/", (req, res) => {
    res.render("index", { ip: `ws://${ip}:${PORT}` });
});

app.get("/db", (req, res) => {
    res.sendFile(path.join(__dirname, "client/db.html"));
});

app.listen(PORT, () => {
    console.log(`node: SERVER STARTED at port ${PORT}`);
});

setInterval(() => {
    const sensor_data = [];

    SENSORS.forEach((sensor) => {
        if (sensor.timeout > 10) {
            sensor.send("disconnect");

            SENSORS.delete(sensor);
            console.log(`Removed unresponsive sensor ${sensor.id}`);
        } else {
            sensor.data.id = sensor.id;
            sensor.data.timeout = sensor.timeout;

            let hasZero = false;
            for (key in sensor.data) {
                if (sensor.data[key] === 0) {
                    hasZero = true;
                    break;
                }
            }

            if (!hasZero) {
                for (key in sensor.data) {
                    if (key !== "id" || key !== "timeout") {   
                        sensor.averageData[key] = (sensor.averageData[key] + sensor.data[key]) / sensor.averageCounter;
                    } 

                    delete sensor.averageData["id"];
                    delete sensor.averageData["timeout"];

                }
                
                // console.log(sensor.data);
                sensor.averageCounter++;

                if (sensor.averageCounter > 5) {
                    console.log(sensor.averageData);

                    sensor.averageCounter = 1;

                    sensor.averageData.temperature = 0;
                    sensor.averageData.humidity = 0;
                    sensor.averageData.ozone = 0;
                    sensor.averageData.carbonMonoxide = 0;

                    // Create a sample test data for the database
                    // const sensorData = new SensorData({
                    //     sensorId: sensor.id,
                    //     temperature: sensor.averageData.temperature,
                    //     humidity: sensor.averageData.humidity,
                    //     ozone: sensor.averageData.ozone,
                    //     carbonMonoxide: sensor.averageData.carbonMonoxide,
                    // });

                    // // Save the sample data to the database
                    // saveSensorData(sensorData);
                }
            }

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

    USERS.forEach((user) => {
        user.send(JSON.stringify(sensor_data));
    });
}, 1000);
