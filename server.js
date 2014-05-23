var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

var requestHandler = function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('<html><body><h1>Hello World</h1></body></html>');
}
http.createServer(requestHandler).listen(3000);

console.log('Server running on port 3000.');