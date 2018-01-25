/*
* created by george.silva
* 22.01.2018
*/

'use strict'

var app = require('./app/config/express.js');

app.listen(3000, function() {
	console.log("Server up and running on Port 3000");

	// Discover and Initialize endpoints
	app.services.endpoints.getEndPoints().then(function(endpoints) {
		if (endpoints) {
			console.log("Services discovered sucessfully!");
		} else {
			console.log("Services discovered failed!");
		}
	});	
	
});