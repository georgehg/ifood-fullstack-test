/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const app = require('./app/config/express.js');

const port = process.env.GTW_PORT || 5200;

app.listen(port, function() {
	console.log("Server up and running on Port " + port);

	// Discover and Initialize endpoints
	app.services.endpoints.getEndPoints().then(function(endpoints) {
		if (endpoints) {
			console.log("Services discovered sucessfully!");
			//console.log(JSON.stringify(endpoints));
		} else {
			console.log("Services discovered failed!");
		}
	});	
	
});