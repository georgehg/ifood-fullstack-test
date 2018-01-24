/*
* created by george.silva
* 23.01.2018
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
        const orderListUrl = app.services.endpoints.v1.order_service.orders.href;
        return new Promise(function(resolve, reject) {
            request({url: orderListUrl}, function(err, resp, body) {
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
        const orderFindUrl = app.services.endpoints.v1.order_service.orders.href;
        return new Promise(function(resolve, reject) {
            request({url: orderFindUrl+"/"+id}, function(err, resp, body) {
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
                resolve({statusCode: 400, content: "Query params can not be empty!"});
            }
            
            let orderSearchUrl;
            const orderSearch = app.services.endpoints.v1.order_service.orders.links.search.links;

            //Resolve with search endpoint to use
            _.forEach(orderSearch, function(fields, rel) {
                if (_.difference(_.keys(query), fields.params).length == 0 ) {
                    orderSearchUrl = orderSearch[rel].href;
                }
            });

            if (!orderSearchUrl) {
                resolve({statusCode: 400, content: "Invalid query params!"});
            }

            request({url: orderSearchUrl}, function(err, resp, body) {
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