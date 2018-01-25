/*
* created by george.silva
* 22.01.2018
*/

'use strict'

const _ = require('lodash');
const request = require('request').defaults({json: true});    
const Promise = require('promise');

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

            const clientListUrl = linkHelper.getLink(CLIENTS_URL_PATH);
            if (!clientListUrl) {
                reject("Service not Available");
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
    }

    function _find(id) {

        return new Promise(function(resolve, reject) {

            const clientFindUrl = linkHelper.getLink(CLIENTS_URL_PATH);
            if (!clientFindUrl) {
                reject("Service not Available");
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
    }

    function _search(query) {

        return new Promise(function(resolve, reject) {

            if (_.isEmpty(query)) {
                resolve({statusCode: 400, content: "Query params can not be empty!"});
            }
            
            
            const clientSearch = linkHelper.getLink(CLIENTS_URL_PATH);
            if (!clientSearch) {
                reject("Service not Available");
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
            }

            request({url: clientSearchUrl, qs: query}, function(err, resp, body) {
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