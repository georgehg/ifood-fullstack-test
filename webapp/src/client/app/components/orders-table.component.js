/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .component('ordersTable', {

            controllerAs: 'vm',

            bindings: {
                ordersData: '<',
            },

            templateUrl: 'app/components/orders-table-template.html',

            controller: class OrdersTable {

                constructor($uibModal) {
                    this.uibModal = $uibModal;
                }

                showDetail(order) {
                    var vm = this;

                    vm.uibModal.open({
                        backdrop: true,
                        size: 'lg',
                        component: 'ordersDetails',
                        resolve: {
                            orderDetail: function() {
                                return order;
                            }
                        }
                    });
                }

            }
        });
    
})();