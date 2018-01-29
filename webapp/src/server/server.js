/*
* created by george.silva
* 28.01.2018
*/

'use strict'

const http = require('http');
const express = require('express');
const app = express();
const path = require('path');

app.disable('etag').disable('x-powered-by');

var environment = process.env.NODE_ENV;
var port = process.env.PORT || 7200;

switch (environment){
    case 'PROD':
        console.log('** PRODUCTION **');
        console.log('serving from ' + './client/build ');
        app.use('/', express.static('./client/build'));
        app.use('/', express.static('./client/app'));
        app.use('/bower_components', express.static('./bower_components'));
        app.get('/app/*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')));
        break;
    case 'STAGE':
    case 'BUILD':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('Serving from ' + './src/client');
        app.use('/', express.static('./src/client'));
        app.use('/bower_components', express.static('./bower_components'));

        // Endpoint required for Angular front end routing performed by UI Router
        // work correctly for user nagivation direct in the browser
        //app.get('/app/*', (req, res) => res.sendFile(path.join(__dirname, '../.././.tmp/serve', 'index.html')));

        break;

}



http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd());
});