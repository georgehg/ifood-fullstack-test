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
        return $resource(environment.getApiRoute() + '/orders/search');
    }

})();