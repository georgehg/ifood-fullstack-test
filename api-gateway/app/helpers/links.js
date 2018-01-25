/*
* created by george.silva
* 25.01.2018
*/

'use strict'

const _ = require('lodash');

const helper = function(app) {

	return {
		getLink: _getLink
	}

    function _getLink(path) {
        const endpoints = app.services.endpoints;
        return _.get(endpoints, path);
    }
}

module.exports = helper;