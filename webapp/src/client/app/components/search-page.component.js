/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .component('searchPage', {

            controllerAs: 'vm',

            templateUrl : 'app/components/search-page-template.html',

            controller: class SearchPageComponent {

                constructor($filter, orderSearchResource) {
                    this.filter = $filter
                    this.orderSearchResource = orderSearchResource;;
                }

                $onInit() {
                    var vm = this;

                    vm.startDate = new Date();
                    vm.endDate = new Date();
                    vm.clientName = "";
                    vm.clientPhone = "";
                    vm.clientEmail = "";

                    vm.ordersData = [];
                    vm.loading = false;
                    vm.noOrdersFound = false;
                    vm.errorsFound = false;
                }

                doSearch() {
                    var vm = this;

                    vm.loading = true;
                    vm.ordersData = [];
                    vm.noOrdersFound = false;
                    vm.errorsFound = false;

                    var params = {
                        start: vm.filter('date')(vm.startDate, 'yyyy-MM-ddTHH:mm:ssZ'),
                        end: vm.filter('date')(vm.endDate, 'yyyy-MM-ddTHH:mm:ssZ'),
                    };

                    if (vm.clientName) {
                        params.name = vm.clientName;
                    };

                    if (vm.clientPhone) {
                        params.phone = vm.clientPhone;
                    };

                    if (vm.clientEmail) {
                        params.email = vm.clientEmail;
                    };

                    vm.orderSearchResource.query(params
                        ,searchOrdersComplete
                        ,searchOrdersFailed
                    );

                    function searchOrdersComplete(orders) {
                        vm.loading = false;
                        vm.noOrdersFound = orders.length == 0;
                        vm.ordersData = orders;
                    }

                    function searchOrdersFailed(error) {
                        vm.loading = false;
                        vm.errorsFound = true;
                        vm.ordersData = [];
                    }

                }
                
            }
        
        });

})();
