/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');

const routes = function(app) {

	const clientApi = app.api.clients;
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

		const orderQueryKeys = ['start', 'end'];
		let orderQuery = _.pick(req.query, orderQueryKeys);
		const clienQuerytKeys = _.difference(_.keys(req.query), orderQueryKeys);
		const clientQuery = _.pick(req.query, clienQuerytKeys);

		if (_.keys(orderQuery).length < 2) {
        	res.status(400).json('Not enough Order query params:' + JSON.stringify(req.query));
        	return;
        }

        if (_.keys(clientQuery).length == 0) {
        	res.status(400).json('Not enough Client query params:' + JSON.stringify(clientQuery));
        	return;
        }

		clientApi.search(clientQuery)
			.then(function(response) {

				let clients = response.content.clients;
				clients.forEach(function(client) {
					orderQuery.clientId = client._links.self.href.split('clients/')[1];
					orderApi.search(orderQuery).then
				});


				//res.status(response.statusCode).json(response.content);


			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
		/*orderApi.search(req.query)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});*/

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