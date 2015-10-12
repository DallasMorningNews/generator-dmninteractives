'use strict';
var express = require('express'),
    http = require('http');


var app = express();
var server = http.createServer(app);

app.use('/static',express.static(__dirname + '/public/static'));



/*-------------------------------------------------------
            ROUTES
-------------------------------------------------------*/

app.get("/", function (req, res) {   
    res.sendFile("public/index.html", {root: __dirname});
});

/*-------------------------------------------------------
            Server
-------------------------------------------------------*/
server.listen(3000, 'localhost');
server.on('listening', function() {
  console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});