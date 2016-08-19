angular.module('starter')

        .controller('BamCtrl', function (ValidacaoModuloFactory, ExtraModuloFactory, $scope, LoadModuloFactory, StorageModuloFactory, UsuariosApiFactory) {
            LoadModuloFactory.show();
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            $scope.img = function (dados) {
                return ExtraModuloFactory.img(dados);
            };

            $scope.dados = {};
            $scope.total_pdv = [];
            $scope.primeira_visita = [];
            $scope.segunda_visita = [];
            $scope.options_pie = {};

            UsuariosApiFactory.relatorios($scope.user.id, function (result) {
                if (ValidacaoModuloFactory.isOk(result.status)) {
                    $scope.dados = result.data.response.result;

                    var primeira = 0;
                    var segunda = 0;

                    angular.forEach($scope.dados.checkins_realizados, function (v, k) {
                        if (v.qtd > 1) {
                            segunda++;
                        } else {
                            primeira++;
                        }
                    });

                    $scope.options_pie = {
                        thickness: 10,
                        mode: "gauge",
                        total: $scope.dados.clientes_total.total
                    };

                    $scope.total_pdv = [
                        {label: "Total PDV", value: $scope.dados.clientes_total.total, color: "#cccccc", suffix: ""}
                    ];

                    $scope.primeira_visita = [
                        {label: "1ª Visita", value: primeira, color: "#F0AD4E", suffix: ""}
                    ];

                    $scope.segunda_visita = [
                        {label: "2ª Visita", value: segunda, color: "#5CB85C", suffix: ""}
                    ];
                    
                    $scope.teste = [
                        {label: "T1", value: 15, color: "#5cb85c"},
                        {label: "T2", value: 17, color: "#f0ad4e"},
                        {label: "T3", value: 20, color: "#00aced"},
                        {label: "T4", value: 15, color: "#d9534f"}
                    ];

                    var rac_options_total = 0;
                    angular.forEach($scope.dados.geral_rac, function (v, k) {
                        rac_options_total += parseInt(v.total);
                        $scope.rac_options = {
                            thickness: 7,
                            mode: "gauge",
                            total: rac_options_total
                        };
                        v.dados = [
                            {label: '', value: v.total, color: v.color, suffix: ""}
                        ];
                    }, $scope.dados.rota_bem);

                    angular.forEach($scope.dados.rota_bem, function (v, k) {
                        v.options = {
                            thickness: 7,
                            mode: "gauge",
                            total: v.geral
                        };
                        v.dados = [
                            {label: "", value: v.total, color: "#5CB85C", suffix: ""}
                        ];
                    }, $scope.dados.rota_bem);

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


            $scope.calcMedia = function (value) {
                var total = 0;
                var linha = 0;
                angular.forEach(value, function (v, k) {
                    total += parseInt(v.total);
                    linha++;
                });
                return (total / linha) + 'pt.';
            }


        });
