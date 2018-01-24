/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	const orderApi = app.api.orders;

	app.get('/orders', function(req, res) {

		orderApi.list().then(function(clients) {
			if (!clients.error && clients.statusCode == 200) {
				res.json(clients.content);
			} else {
				res.send(clients.statusCode);
			}
		});
		
	});

	app.get('/orders/:id', function(req, res) {

		orderApi.find(req.params.id).then(function(clients) {
			if (!clients.error && clients.statusCode == 200) {
				res.json(clients.content);
			} else {
				res.send(clients.statusCode);
			}
		});

	});

}

module.exports = routes;