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
var port = process.env.PORT || 7200;

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

http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd());
});