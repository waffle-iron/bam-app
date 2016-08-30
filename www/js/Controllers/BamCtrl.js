angular.module('starter')

        .controller('BamCtrl', function (ValidacaoModuloFactory, Config, $scope, LoadModuloFactory, StorageModuloFactory, UsuariosApiFactory) {
            LoadModuloFactory.show();
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            $scope.dados = {};
            $scope.total_pdv = [];
            $scope.primeira_visita = [];
            $scope.segunda_visita = [];
            $scope.options_pie = {};
            $scope.programa_rac = [];
            $scope.rac_options = [];
            $scope.rac_colors = [];
            $scope.total_prog_rac = 0;
            var _programa_rac = [];
            $scope.pie_open = 0;

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

                    _programa_rac = [];
                    _programa_rac.push(['teste a', 'teste b']);
                    angular.forEach($scope.dados.geral_rac, function (v, k) {
                        _programa_rac.push([v.nome, parseInt(v.total)]);
                    });

                    //loadMapaGoogle(_programa_rac);

                    $scope.pie_open = 1;

                    angular.forEach($scope.dados.rota_bem, function (v, k) {
                        $scope.total_prog_rac = parseInt($scope.dados.clientes_total.total);
                        v.options = {
                            thickness: 7,
                            mode: "gauge",
                            total: v.geral
                        };
                        v.dados = [
                            {label: "", value: v.total, color: "#5CB85C", suffix: ""}
                        ];
                    }, $scope.dados.rota_bem);
                    LoadModuloFactory.hide();
                    loadMapaGoogle();
                } else {
                    LoadModuloFactory.hide();
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao, 'Erro');
                }

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
            
            var loadMapaGoogle = function(){
                try{
                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {
                        var d = [
                            ['Task', 'Hours per Day'],
                            ['Work', 11],
                            ['Eat', 2],
                            ['Commute', 2],
                            ['Watch TV', 2],
                            ['Sleep', 7]
                        ];

                        var data = google.visualization.arrayToDataTable(_programa_rac);

                        var options = {
                            title: '',
                            pieHole: 0.6,
                            legend: 'none',
                            chartArea: {
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%"
                            },
                            backgroundColor: {
                                stroke: "#fff",
                                strokeWidth: 0,
                                fill: "#fff"
                            },
                            pieSliceBorderColor: "#fff"
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                        chart.draw(data, options);
                    }
                }
                catch(e){
                    console.log(e);
                }
                
            }
            
            $scope.$on('$stateChangeComplete', function () {
                loadMapaGoogle();
            });


        });
