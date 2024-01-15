const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/{}', (req, res) => {
    res.sendFile(__dirname + "/client/index-sensor.html");
});

DEVICES = {};
SENSORS = {};

// SocketIO connection
io.on('connection', socket => {
    console.log('user connected');
    socket.emit('start', 'Connected to server');

    socket.id = Math.floor(Math.random()*1_000_000);

    socket.on('p', () => {
        socket.emit('pong');
    });
    
    socket.on('device-connect', () => {
        DEVICES[socket.id] = socket;
    });

    socket.on('sensor-connect', () => {
        SENSORS[socket.id] = socket;
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        delete SENSORS[socket.id];
        delete DEVICES[socket.id];
    });
});

function executePerFrame() {
    sensorIDs = [];
    for (key in SENSORS) {
        sensorID = SENSORS[key].id;
        sensorIDs.push(sensorID);
    }

    for (key in DEVICES) {
        device = DEVICES[key];
        
        device.emit('active-sensors', sensorIDs);
    }
}
setInterval(executePerFrame, 100);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});