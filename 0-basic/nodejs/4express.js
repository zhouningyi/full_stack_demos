

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = 7777;
app.set('port', port);
server.listen(port);

app.get('/', (req, res) => {
	res.json({xx:1})
});

