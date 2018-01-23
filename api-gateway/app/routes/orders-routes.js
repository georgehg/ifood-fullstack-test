/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	app.get('/orders/search', function(req, res) {
		res.json({info: "Hello Route"});
	});

}

module.exports = routes;