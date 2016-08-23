angular.module('starter')

        .controller('ClienteRelatorioCtrl', function ($stateParams, ClientesApiFactory, ValidacaoModuloFactory, ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {


            LoadModuloFactory.show();
            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);

            $scope.dados = {};
            $scope.pie_open = 0;
            $scope.options_pie = {};

            ClientesApiFactory.relatorios($stateParams.id, function (result) {
                if (ValidacaoModuloFactory.isOk(result.status)) {
                    $scope.dados = result.data.response.result;

                    $scope.options_pie = {
                        thickness: 10,
                        mode: "gauge",
                        total: 1000
                    };

                    $scope.total_pdv = [
                        {label: "Média", value: calcMedia($scope.dados.certificacoes), color: "green", suffix: "pt."}
                    ];

                }
                LoadModuloFactory.hide();
            });

            $scope.isColor = function (value) {
                if (value.tipo === 'radio') {
                    if (value.selecionado == 1) {
                        return 'color-green';
                    } else {
                        return 'color-red';
                    }
                } else {
                    return 'color-grey';
                }
            }

            $scope.isTipo = function (value) {
                if (value.tipo === 'Rota BAM') {
                    return 'green';
                } else if (value.tipo === 'Programa de Mercado - RAC') {
                    return 'yellow';
                } else if (value.tipo === 'Ativação 52 Semanas') {
                    return 'grey';
                } else if (value.tipo === 'Ocorrências') {
                    return 'red';
                }
            }

            $scope.isIcon = function (value) {
                if (value.tipo === 'radio') {
                    if (value.selecionado == 1) {
                        return 'ion-ios-checkmark-outline';
                    } else {
                        return 'ion-ios-close-outline';
                    }
                }
            }

            $scope.forceInt = function (value) {
                return parseInt(value);
            }

            var calcMedia = function (value) {
                var total = 0;
                var linha = 0;
                angular.forEach(value, function (v, k) {
                    total += parseInt(v.total);
                    linha++;
                });
                var t = (total / linha);
                return (t || 0);
            }

        });
