'use strict';
var express = require('express'),
    http = require('http');


var app = express();
var server = http.createServer(app);
var meta = require('./meta.json');

app.use(express.static(__dirname + '/preview/static'));



/*-------------------------------------------------------
            ROUTES
-------------------------------------------------------*/

app.get("/", function (req, res) {   
	res.sendFile("preview/index.html", {root: __dirname});
});

/*-------------------------------------------------------
            Server
-------------------------------------------------------*/
server.listen(3000, 'localhost');
server.on('listening', function() {
  console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});