/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	app.get('/api/v1', function(req, res) {
		res.json({_links: '/api/v1/orders/search'});

	});

}

module.exports = routes;