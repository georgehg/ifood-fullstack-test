/*
* created by george.silva
* 25.01.2018
*/

'use strict'

const _ = require('lodash');
const Promise = require('promise');

const helper = function(app) {

	return {
		getLink: _getLink
	}

    function _getLink(path) {
        return Promise.resolve(app.services.endpoints.getEndPoints())
        	.then(function(endpoints) {
        		return _.get(endpoints, path);
        	});        
    }
}

module.exports = helper;