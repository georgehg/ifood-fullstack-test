/*
* created by george.silva
* 22.01.2018
*/

'use strict'

var app = require('./app/config/express.js');

app.listen(3000, function() {
	console.log("Server up and running on Port 3000");
});