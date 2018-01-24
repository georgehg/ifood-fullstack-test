/*
* created by george.silva
* 23.01.2018
*/

'use strict'

const routes = function(app) {

	const clientApi = app.api.clients;

	app.get('/clients', function(req, res) {

		clientApi.list()
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send();
			});
		
	});

	app.get('/clients/:id', function(req, res) {

		clientApi.find(req.params.id)
			.then(function(response) {
				res.status(response.statusCode).json(response.content);
			}).catch(function(reason) {
				res.status(500).send();
			});
		
	});

}

module.exports = routes;