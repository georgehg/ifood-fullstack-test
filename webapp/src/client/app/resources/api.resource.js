/**
 * @author george.silva
 * created on 29.01.2018
 */
(function () {

    'use strict';

    angular
        .module('app')
        .factory('apiResource', apiResource);

    /** @ngInject */
    function apiResource($resource, environment) {
        return $resource('/api');
    }

})();