/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');

const routes = function(app) {

	const _apiBasePath = app.config.gateway.base_path;
	const _apiVersion = app.config.gateway.api_version;

	const _clientApi = app.api.clients;
	const _orderApi = app.api.orders;

	app.get(_apiBasePath + '/' + _apiVersion + '/orders', function(req, res) {

		_orderApi.list()
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
	});

	app.get(_apiBasePath + '/' + _apiVersion + '/orders/search', function(req, res) {

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

        let searchResult = {};

		_clientApi.search(clientQuery)
			.then(function(response) {

				let promisesList = [];
				searchResult = response.content.clients;
				_.forEach(searchResult, function(client, index) {
					let query = {}
					_.assign(query, orderQuery);
					query.clientId = _.last(client._links.self.href.split('/'));
					promisesList.push(searchClientOrders(index, query));
				});

				Promise.all(promisesList)
			    	.then(function(status) {
			    		res.status(200).json(searchResult);
				      }).catch(function(reason) {
				      	console.log("error: ", reason);
				        res.status(500).send(reason);
					});

			}).catch(function(reason) {
				res.status(500).send(reason);
			});

		function searchClientOrders(index, query) {
			return _orderApi.search(query)
				.then(function(response) {
					searchResult[index].orders = response.content.orders;
				});
		};

	});	

	app.get(_apiBasePath + '/' + _apiVersion + '/orders/:id', function(req, res) {

		_orderApi.find(req.params.id)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});

	});

}

module.exports = routes;