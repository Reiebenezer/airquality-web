const app = require('express')();
const appWs = require('express-ws')(app);

const PORT = process.env.PORT || 1337;

app.ws('/', ws => {
    ws.on('init', (id) => {
        console.log(`Sensor ${id} has connected to server`);
    });

    ws.on('data', data => {
        console.log(`Data Received: ${data.map((key, value) => { return `${key}: ${value}\n`})}`);
    });
});

app.listen(PORT, () => {
    console.log('node: SERVER STARTED');
});