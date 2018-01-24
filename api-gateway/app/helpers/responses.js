/*
* created by george.silva
* 24.01.2018
*/

'use strict'

const request = require('request').defaults({json: true});    
const Promise = require('promise');

const helper = function(app) {

	return {
		handle: _handleResponse
	}

    function _handleResponse(resp, body) {

        let response = {statusCode: resp.statusCode, content: {}};

        if (resp.statusCode == 200) {
            if (body._embedded) {
                Object.keys(body._embedded).forEach(function(entity) {
                    body._embedded[entity].forEach(function(entry) {
                        entry._links = undefined;
                    })
                    response.content[entity] = body._embedded[entity];                    
                });
            } else {
                if(body._links) {
                    body._links = undefined;
                }                
                response.content = body;
            }
        } else {
            response.content = body;
        }
        
        return response;
    }
}

module.exports = helper;