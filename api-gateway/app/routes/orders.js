/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	const orderApi = app.api.orders;

	app.get('/orders', function(req, res) {

		orderApi.list()
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
	});

	app.get('/orders/search', function(req, res) {
		
		orderApi.search(req.query)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});

	});	

	app.get('/orders/:id', function(req, res) {

		orderApi.find(req.params.id)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});

	});

}

module.exports = routes;