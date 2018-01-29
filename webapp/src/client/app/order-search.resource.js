/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {

    'use strict';

    angular
        .module('app')
        .factory('orderSearchResource', orderSearchResource);

    /** @ngInject */
    function orderSearchResource($resource, environment) {
        return $resource(environment.getApiRoute() + '/orders/search', {},
        {query: {
            method: 'GET',
            isArray: true,
            responseType: 'json',
            transformResponse: function (response) {

                var orders = [];
                
                angular.forEach(response, function(client) {
                    angular.forEach(client.orders, function(order) {
                        var orderData = {
                            date: order.createdAt,
                            name: client.name,
                            phone: client.phone,
                            email: client.email,
                            total: 0,
                            details: []
                        };

                        angular.forEach(order.items, function(item) {
                            orderData.details.push(item);
                            orderData.total += item.price * item.quantity;
                        });

                        orders.push(orderData);
                    });

                });

                return orders;
            }
        }
        });
    }

})();