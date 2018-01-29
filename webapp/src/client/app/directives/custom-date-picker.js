/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('ctDatePicker', ctDatePicker);

    /** @ngInject */
    function ctDatePicker() {

        var directive = {
            link: link,
            templateUrl: 'app/directives/custom-date-picker.html',
            restrict: 'EA',
            scope: {
                ctDtpId: '@',
                ctDtpName: '@',
                ctDtpFormat: '@',
                ctDtpOptions: '@',
                ctDtpModel: '=',
                ctDtpRequired: '@'
            },
        };

        return directive;

        function link(scope) {
            scope.open = open;
            scope.opened = false;
            scope.ctDtpFormat = scope.ctDtpFormat || "dd-MMM-yyyy";
            scope.altInputFormats = ['M!/d!/yyyy'];

            function open() {
                scope.opened = true;
            }
        };

    }

})();