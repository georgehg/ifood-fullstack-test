/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .component('searchPanel', {

            controllerAs: 'vm',

            templateUrl : 'app/components/search-panel-template.html',

            controller: class SearchPanelComponent {

                constructor($filter) {
                    this.filter = $filter;
                }

                $onInit() {
                    var vm = this;

                    vm.startDate = new Date();
                    vm.endDate = new Date();
                    vm.clientName = "";
                    vm.clientPhone = "";
                    vm.clientEmail = "";
                }

                doSearch() {
                    var vm = this;

                	console.log(vm.startDate, vm.endDate, vm.clientName, vm.clientPhone, vm.clientEmail);
                }
                
            }
        
        });

})();
