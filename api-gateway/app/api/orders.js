/*
* created by george.silva
* 23.01.2018
*/

'use strict'

const _ = require('lodash');
const Promise = require('promise');
const request = require('request').defaults({json: true});

const api = function(app) {

    const ORDERS_URL_PATH = 'v1.order_service.orders.href';
    const ORDERS_SEARCH_PATH = 'v1.order_service.orders.links.search.links';

    const responseHelper = app.helpers.responses;
    const linkHelper = app.helpers.links;

    return {
        list: _list,
        find: _find,
        search: _search
    }

    function _list() {

        return new Promise(function(resolve, reject) {

            linkHelper.getLink(ORDERS_URL_PATH).then(function(orderListUrl) {
                if (!orderListUrl) {
                    reject("Service not Available");
                    return;
                }

                request({url: orderListUrl}, function(err, resp, body) {
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

            linkHelper.getLink(ORDERS_URL_PATH).then(function(orderFindUrl) {
                if (!orderFindUrl) {
                    reject("Service not Available");
                    return;
                }

                request({url: orderFindUrl+"/"+id}, function(err, resp, body) {
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
            };
            
            linkHelper.getLink(ORDERS_SEARCH_PATH).then(function(orderSearch) {

                if (!orderSearch) {
                    reject("Service not Available");
                    return;
                };

                let orderSearchUrl = {};
                //Resolve witch search endpoint to use
                _.forEach(orderSearch, function(fields, rel) {

                    if (_.keys(query).length == fields.params.length &&
                        _.difference(fields.params, _.keys(query)).length == 0 ) {
                        orderSearchUrl = orderSearch[rel].href;
                    }
                });

                if (_.isEmpty(orderSearchUrl)) {
                    resolve({statusCode: 400, content: "Invalid query params!"});
                    return;
                };

                request({url: orderSearchUrl, qs: query}, function(err, resp, body) {
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