/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const request = require('request').defaults({json: true});    
const Promise = require('promise');

const api = function(app) {

    const responseHelper = app.helpers.responses;

    return {
        list: _list,
        find: _find,
        search: _search
    }

    function _list() {
        const clientService = app.services.endpoints.v1.client_service;
        return new Promise(function(resolve, reject) {
            request({url: clientService.clients.href}, function(err, resp, body) {
                if(err) {
                    console.log(err);
                    reject(err);                  
                } else {
                    resolve(responseHelper.handle(resp, body));
                }
            });
        });
    }

    function _find(id) {
        const clientService = app.services.endpoints.v1.client_service;
        return new Promise(function(resolve, reject) {
            request({url: clientService.clients.href+"/"+id}, function(err, resp, body) {
                if(err) {
                    console.log(err);
                    reject(err);                  
                } else {
                    resolve(responseHelper.handle(resp, body));
                }
            });
        });
    }

    function _search(params) {
        const clientService = app.services.endpoints.v1.client_service;
        return new Promise(function(resolve, reject) {
            request({url: clientService.clients.links.search}, function(err, resp, body) {
                if(err) {
                    console.log(err);
                    reject(err);                  
                } else {
                    resolve(responseHelper.handle(resp, body));
                }
            });
        });
    }

}

module.exports = api;