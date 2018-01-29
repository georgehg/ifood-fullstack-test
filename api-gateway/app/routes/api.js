/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const routes = function(app) {

	const _apiBasePath = app.config.gateway.base_path;
	const _apiVersion = app.config.gateway.api_version;

	app.get('/', function(req, res) {
		res.json({api: _apiBasePath + '/' + _apiVersion});

	});

}

module.exports = routes;