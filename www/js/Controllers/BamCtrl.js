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
                        {label: "1ª Visita", value: primeira, color: "orange", suffix: ""}
                    ];

                    $scope.segunda_visita = [
                        {label: "2ª Visita", value: segunda, color: "green", suffix: ""}
                    ];

                    var rac_options_total = 0;
                    angular.forEach($scope.dados.geral_rac, function (v, k) {
                        rac_options_total += parseInt(v.total);
                        $scope.rac_options = {
                            thickness: 5,
                            mode: "gauge",
                            total: rac_options_total
                        };
                        v.dados = [
                            {label: '', value: v.total, color: v.color, suffix: ""}
                        ];
                    }, $scope.dados.rota_bem);


                    angular.forEach($scope.dados.rota_bem, function (v, k) {
                        v.options = {
                            thickness: 5,
                            mode: "gauge",
                            total: v.geral
                        };
                        v.dados = [
                            {label: "", value: v.total, color: "green", suffix: ""}
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
