/**
 * @author george.silva
 * created on 29.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .component('ordersDetails', {

            controllerAs: 'vm',

            bindings: {
                modalInstance: "<",
                resolve: "<"
            },

            templateUrl: 'app/components/order-details-modal-template.html',

            controller: class OrdersDetails {

                $onInit() {
                    var vm = this;
                    vm.order = vm.resolve.orderDetail;
                    vm.details = vm.order.details;
                };

            }
        });
    
})();