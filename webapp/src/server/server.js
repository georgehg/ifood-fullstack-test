/*
* created by george.silva
* 28.01.2018
*/

'use strict'

const http = require('http');
const express = require('express');
const app = express();

app.disable('etag').disable('x-powered-by');

var environment = process.env.NODE_ENV;
var web_port = process.env.WEB_PORT || 7200;
var gtw_host = process.env.GTW_HOST || 'localhost';
var gtw_port = process.env.GTW_PORT || 5200;

switch (environment){
    case 'PROD':
        console.log('** PRODUCTION **');
        console.log('Serving from ' + './src/client');
        break;
    default:
        console.log('** DEV **');
        console.log('Serving from ' + './src/client');
        break;
}

app.use('/', express.static('./src/client'));
app.use('/bower_components', express.static('./bower_components'));

// Return API Gateway address
app.get('/api', function(req, res) {
    res.json({host: gtw_host, port: gtw_port});
});

http.createServer(app).listen(web_port, function() {
    console.log('Express server listening on port ' + web_port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd());
});