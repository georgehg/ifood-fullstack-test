/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	const _clientApi = app.api.clients;

	app.get('/orders/search', function(req, res) {
		_clientApi.search().then(function(clients) {
			if (!clients.error && clients.statusCode == 200) {
				res.json(clients.content);
			} else {
				res.send(clients.statusCode);
			}
		});
	});

}

module.exports = routes;