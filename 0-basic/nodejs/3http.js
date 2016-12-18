const http = require('http');

http.createServer((request, response) => {
	response.end('hello visitor!');
}).listen(8888)

