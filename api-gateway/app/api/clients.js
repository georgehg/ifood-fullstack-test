/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const request = require('request').defaults({json: true});    
const Promise = require('promise');

const clients = function(app) {

    return {
        search: _search
    }

    function _search(params) {
        const clientService = app.services.endpoints.v1.client_service;
        return new Promise(function(resolve, reject) {
            request({url: clientService.clients.href}, function(err, resp, body) {
                resolve({error: err, statusCode: resp.statusCode, content: body._embedded.clients});
            });
        });
    }

}

module.exports = clients;