angular.module('starter')

        .controller('ClienteRelatorioCtrl', function (Config, $stateParams, ClientesApiFactory, ValidacaoModuloFactory, ExtraModuloFactory, $scope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {


            LoadModuloFactory.show();
            $scope.cliente = {};
            ClientesTable.first(
                    {
                        from: 'c.*, cd.cidade, e.estado',
                        alias: 'c',
                        join: 'LEFT JOIN cidades as cd ON c.cidade_id = cd.id LEFT JOIN estados as e ON c.estado_id = e.id',
                        where: 'c.id =' + $stateParams.id
                    }, function (result) {
                $scope.cliente = result;
                $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                //LoadModuloFactory.hide();

            });

            $scope.dados = {};
            $scope.pie_open = 0;
            $scope.options_pie = {};

            ClientesApiFactory.relatorios($stateParams.id, function (result) {
                if (ValidacaoModuloFactory.isOk(result.status)) {
                    $scope.dados = result.data.response.result;
                    $scope.totalGeral = calcMedia($scope.dados.certificacoes);

                    $scope.options_pie = {
                        thickness: 10,
                        mode: "gauge",
                        total: 1000,
                        legendValue: 3
                    };

                    $scope.total_pdv = [
                        {label: "Média", value: calcMedia($scope.dados.certificacoes), color: corMedia(calcMedia($scope.dados.certificacoes)), suffix: ""}
                    ];
                    LoadModuloFactory.hide();
                } else {
                    LoadModuloFactory.hide();
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao + ' | Código de erro: ' + result.status, 'Erro');
                }

            });

            $scope.isColor = function (value) {
                if (value.tipo === 'radio') {
                    if (value.verdadeiro !== null) {
                        if (value.selecionado == 1) {
                            return 'color-green';
                        } else {
                            return 'color-red';
                        }
                    } else {
                        return 'color-grey';
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
                    if (value.verdadeiro !== null) {
                        if (value.selecionado == 1) {
                            return 'ion-ios-checkmark-outline';
                        } else {
                            return 'ion-ios-close-outline';
                        }
                    } else {
                        return 'ion-document-text';
                    }
                } else {
                    return 'ion-document-text';
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
                return (t || 0).toFixed(0);
            }

            var corMedia = function (media) {
                if (media >= 750) {
                    return "#5cb85c";
                } else {
                    return "#d9534f";
                }
            }

            $scope.converteNome = function (str) {
                return ExtraModuloFactory.conversaoDeHistoricos(str);
            }

        })

        .controller('ClienteHistoricoCtrl', function (Config, ExtraModuloFactory, $scope, LoadModuloFactory, ValidacaoModuloFactory, ClientesApiFactory, $stateParams, ClientesTable) {

            $scope.cliente = {};
            ClientesTable.first(
                    {
                        from: 'c.*, cd.cidade, e.estado',
                        alias: 'c',
                        join: 'LEFT JOIN cidades as cd ON c.cidade_id = cd.id LEFT JOIN estados as e ON c.estado_id = e.id',
                        where: 'c.id =' + $stateParams.id
                    }, function (result) {
                $scope.cliente = result;
                $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                LoadModuloFactory.hide();

            });

            $scope.options = {
                sort: 'created',
                page: 1,
                tipo: 2,
                limit: 5,
                direction: 'desc'
            };
            $scope.proximo = true;
            $scope.historico = [];

            var conteudo = function (retorno) {
                $scope.proximo = true;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    $scope.proximo = retorno.data.response.paging.nextPage;
                    $scope.options.page = (retorno.data.response.paging.page + 1);
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        v.tipo_id = converteNome(v.tipo);
                        $scope.historico.push(v);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    LoadModuloFactory.hide();
                } else {
                    LoadModuloFactory.hide();
                    $scope.proximo = false;
                    ExtraModuloFactory.error($scope, 'Nenhum item de histórico localizado.');
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao + ' | Código de erro: ' + retorno.status, 'Erro');
                }

            }

            $scope.loadMore = function () {
                if ($scope.proximo) {
                    LoadModuloFactory.show();
                    ClientesApiFactory.historico($stateParams.id, $scope.options, conteudo);
                }
            };

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

            $scope.$on('$stateChangeComplete', function () {
                $scope.loadMore();
            });

            var converteNome = function (str) {
                return ExtraModuloFactory.conversaoDeHistoricos(str);
            }

        })

        .controller('ClienteHistoricoRespostasCtrl', function (ValidacaoModuloFactory, ExtraModuloFactory, $scope, LoadModuloFactory, ClientesApiFactory, $stateParams, ClientesTable) {

            LoadModuloFactory.show();
            $scope.perguntas = [];
            $scope.produtos = [];
            $scope.cliente = {};
            $scope.tipo = ExtraModuloFactory.desconversaoDeHistoricos($stateParams.tipo);
            $scope.data = $stateParams.data;

            ClientesTable.first(
                    {
                        from: 'c.*, cd.cidade, e.estado',
                        alias: 'c',
                        join: 'LEFT JOIN cidades as cd ON c.cidade_id = cd.id LEFT JOIN estados as e ON c.estado_id = e.id',
                        where: 'c.id =' + $stateParams.id
                    }, function (result) {
                $scope.cliente = result;
                $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
            });

            ClientesApiFactory.detalhesHistorico($stateParams.id, $stateParams.data, $stateParams.tipo, function (resultado) {
                if (ValidacaoModuloFactory.isOk(resultado.status)) {
                    $scope.perguntas = resultado.data.response.result.perguntas;
                    $scope.produtos = resultado.data.response.result.produtos;
                } else {
                    ExtraModuloFactory.info($scope, 'Não foi localizado nenhum registro nesse Check-in');
                }
                LoadModuloFactory.hide();
            })


        });
