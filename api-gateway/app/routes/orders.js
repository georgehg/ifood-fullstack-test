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

		const orderQuery = _.pick(req.query, ['start', 'end']);
		const clientQuery = _.difference(req.query, orderQuery);

		if (_.key(orderQuery).length < 2) {
        	res.status(400).json('Not enough query params:' + JSON.stringify(orderQuery));
        }

        if (_.key(clientQuery).length == 0) {
        	res.status(400).json('Not enough query params:' + JSON.stringify(clientQuery));
        }

		clientApi.search(clientQuery)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
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