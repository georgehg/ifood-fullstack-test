/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	app.get('/', function(req, res) {
		res.json({info: "Hello Root"});

	});

}

module.exports = routes;