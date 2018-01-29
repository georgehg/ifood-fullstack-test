/**
 * @author george.silva
 * created on 28.01.2018
 */
(function () {
    'use strict';

    angular
        .module('app')
        .component('ordersGrid', {

            controllerAs: 'vm',

            templateUrl: 'app/components/orders-grid-template.html',

            controller: class OrdersGrid {

                constructor($scope, $filter, orderSearchResource, notifyService) {
                    this.scope = $scope;
                    this.filter = $filter;
                    this.orderSearchResource = orderSearchResource;
                    this.notifyService = notifyService;
                }

                $onInit() {
                    var vm = this;

                    var columns = [
                        {field: 'createdAt', displayName: 'Date', enableFiltering: false,  width:'100'},
                        {field: 'name', displayName: 'Client Name', width:'200', visible: false},
                        {field: 'phone', displayName: 'Phone', width:'200', visible: false},
                        {field: 'email', displayName: 'E-mail', width:'100', cellFilter: 'floorDate | date: "yyyy-MM-dd"', type: 'date'},
                        {field: 'total_value', displayName: 'Total Value', width:'100'}
                    ];

                    vm.gridOptions = {
                        enableSorting: true,
                        enableFiltering: true,
                        enableGrouping: true,
                        showGridFooter: true,
                        enableGridMenu: true,
                        columnDefs: columns,
                        data: undefined;
                    	}
                    };

                }

                search() {
                    var vm = this;

                    vm.gridOptions.data = undefined;

                    var statusFilter;
                    if (vm.statusFilter.selected.length !=  vm.statusFilter.list.length) {
                        statusFilter = "";
                        angular.forEach(vm.statusFilter.selected, function(status) {
                            statusFilter += "'" + status.name + "',";
                        });
                        statusFilter = statusFilter.slice(0, -1);
                    };

                    var filters = {
                        status: statusFilter
                    };

                    if (vm.faixa_esteira > 0) {
                        filters.faixa_esteira = vm.faixa_esteira_operator + vm.faixa_esteira;
                    };

                    if (vm.faixa_etapa > 0) {
                        filters.faixa_etapa = vm.faixa_etapa_operator + vm.faixa_etapa;
                    };

                    if (vm.faixa_vel > 0) {
                        filters.faixa_vel = vm.velocidade_operator + vm.faixa_vel;
                    };

                    if (vm.filtra_termometro) {
                        filters.termometro = vm.temperatura;
                    };
                    
                    vm.notifyService.notify('on-app-load-start');
                    vm.dataService.getPendenciasPrevenda(filters).$promise
                        .then(function(pendencias) {
                            vm.notifyService.notify('on-app-load-finish');
                            vm.gridOptions.data = pendencias;
                            vm.dataCount = vm.gridOptions.data.length;
                        });
                }

                exportCsv(type) {
                    var vm = this;

                    var stringDate = vm.filter('date')(new Date(), 'yyyyMMddHHmmss');
                    vm.gridOptions.exporterCsvFilename = 'relatorio-pendencias-prv-' + stringDate + '.csv';
                    var rowTypes = vm.uiGridExporterConstants[type];
                    var colTypes = vm.uiGridExporterConstants[type];
                    vm.gridApi.exporter.csvExport(rowTypes, colTypes);
                };

            }
        });
    
})();