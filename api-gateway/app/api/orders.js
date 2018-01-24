/*
* created by george.silva
* 23.01.2018
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
        const orderService = app.services.endpoints.v1.order_service;
        return new Promise(function(resolve, reject) {
            request({url: orderService.orders.href}, function(err, resp, body) {
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
        const orderService = app.services.endpoints.v1.order_service;
        return new Promise(function(resolve, reject) {
            request({url: order_service.orders.href+"/"+id}, function(err, resp, body) {
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
        const orderService = app.services.endpoints.v1.order_service;
        return new Promise(function(resolve, reject) {
            request({url: orderService.orders.links.search}, function(err, resp, body) {
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