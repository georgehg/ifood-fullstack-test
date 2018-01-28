/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');
const Promise = require('promise');
const request = require('request').defaults({json: true});

const api = function(app) {

    const CLIENTS_URL_PATH = 'v1.client_service.clients.href';
    const CLIENTS_SEARCH_PATH = 'v1.client_service.clients.links.search.links';

    const responseHelper = app.helpers.responses;
    const linkHelper = app.helpers.links;

    return {
        list: _list,
        find: _find,
        search: _search
    }

    function _list() {

        return new Promise(function(resolve, reject) {

            linkHelper.getLink(CLIENTS_URL_PATH).then(function(clientListUrl) {
                if (!clientListUrl) {
                    return reject("Service not Available");
                }

                request({url: clientListUrl}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        return reject(err);                  
                    } else {
                        return resolve(responseHelper.handle(resp, body));
                    }
                });            
            });

        });
    }

    function _find(id) {

        return new Promise(function(resolve, reject) {

            linkHelper.getLink(CLIENTS_URL_PATH).then(function(clientFindUrl) {
                if (!clientFindUrl) {
                    return reject("Service not Available");
                }

                request({url: clientFindUrl+"/"+id}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        return reject(err);                  
                    } else {
                        return resolve(responseHelper.handle(resp, body));
                    }
                });
            });

        });

    }

    function _search(query) {

        return new Promise(function(resolve, reject) {

            if (_.isEmpty(query)) {
                return resolve({statusCode: 400, content: "Query params can not be empty!"});
            }            
            
            linkHelper.getLink(CLIENTS_SEARCH_PATH).then(function(clientSearch) {

                if (!clientSearch) {
                    return reject("Service not Available");
                }

                let clientSearchUrl = {};
                //Resolve witch search endpoint to use
                _.forEach(clientSearch, function(fields, rel) {

                    if (_.keys(query).length == fields.params.length &&
                        _.difference(fields.params, _.keys(query)).length == 0 ) {
                        clientSearchUrl = clientSearch[rel].href;
                    }
                });

                if (_.isEmpty(clientSearchUrl)) {
                    return resolve({statusCode: 400, content: "Invalid query params!"});
                }

                request({url: clientSearchUrl, qs: query}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        return resolve(responseHelper.handle(resp, body));
                    }
                });
            });

        });

    }

}

module.exports = api;