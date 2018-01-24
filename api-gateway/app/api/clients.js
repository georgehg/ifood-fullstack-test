/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');
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
        const clientListUrl = app.services.endpoints.v1.client_service.clients.href;
        return new Promise(function(resolve, reject) {
            request({url: clientListUrl}, function(err, resp, body) {
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
        const clientFindUrl = app.services.endpoints.v1.client_service.clients.href;
        return new Promise(function(resolve, reject) {
            request({url: clientFindUrl+"/"+id}, function(err, resp, body) {
                if(err) {
                    console.log(err);
                    reject(err);                  
                } else {
                    resolve(responseHelper.handle(resp, body));
                }
            });
        });
    }

    function _search(query) {
        return new Promise(function(resolve, reject) {

             if (!query) {
                reject("Invalid query params!");
            }
            
            let clientSearchUrl;
            const clientSearch = app.services.endpoints.v1.client_service.clients.links.search.links;

            //Resolve with search endpoint to use
            _.forEach(clientSearch, function(fields, rel) {
                if (_.difference(_.keys(query), fields.params).length == 0 ) {
                    clientSearchUrl = clientSearch[rel].href;
                }
            });

            if (!clientSearchUrl) {
                reject("Invalid query params!");
            }

            request({url: clientSearchUrl}, function(err, resp, body) {
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