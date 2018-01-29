/*
* created by george.silva
* 23.01.2018
*/

'use strict'

const routes = function(app) {

	const _apiBasePath = app.config.gateway.base_path;
	const _apiVersion = app.config.gateway.api_version;
	const _clientApi = app.api.clients;

	app.get(_apiBasePath + '/' + _apiVersion + '/clients', function(req, res) {

		_clientApi.list()
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
	});

	app.get(_apiBasePath + '/' + _apiVersion + '/clients/search', function(req, res) {

		_clientApi.search(req.query)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
	});

	app.get(_apiBasePath + '/' + _apiVersion + '/clients/:id', function(req, res) {

		_clientApi.find(req.params.id)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send(reason);
			});
		
	});

}

module.exports = routes;