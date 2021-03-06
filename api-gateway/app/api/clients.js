/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');
const Promise = require('promise');
const request = require('request').defaults({json: true});

const api = function(app) {

    const _apiVersion = app.config.gateway.api_version;

    const CLIENTS_URL_PATH = _apiVersion + '.client_service.clients.href';
    const CLIENTS_SEARCH_PATH = _apiVersion + '.client_service.clients.links.search.links';

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
                    reject("Service not Available");
                    return;
                }

                request({url: clientListUrl}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(responseHelper.handle(resp, body));
                    }
                });            
            });

        });
    }

    function _find(id) {

        return new Promise(function(resolve, reject) {

            linkHelper.getLink(CLIENTS_URL_PATH).then(function(clientFindUrl) {
                if (!clientFindUrl) {
                    reject("Service not Available");
                    return;
                }

                request({url: clientFindUrl+"/"+id}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        reject(err);                  
                    } else {
                        resolve(responseHelper.handle(resp, body));
                    }
                });
            });

        });

    }

    function _search(query) {

        return new Promise(function(resolve, reject) {

            if (_.isEmpty(query)) {
                resolve({statusCode: 400, content: "Query params can not be empty!"});
                return;
            }
            
            linkHelper.getLink(CLIENTS_SEARCH_PATH).then(function(clientSearch) {

                if (!clientSearch) {
                    reject("Service not Available");
                    return;
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
                    resolve({statusCode: 400, content: "Invalid query params!"});
                    return;
                }

                request({url: clientSearchUrl, qs: query}, function(err, resp, body) {
                    if(err) {
                        console.log(err);
                        reject("Service not Available");
                    } else {
                        resolve(responseHelper.handle(resp, body));
                    }
                });
            });

        });

    }

}

module.exports = api;