angular.module('starter')

        .controller('CervejasCtrl', function ($filter, $state, $timeout, $ionicScrollDelegate, ExtraModuloFactory, $scope, $rootScope, moment, StorageModuloFactory, ProdutosTable, ProdutosClientesTable, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                LoadModuloFactory.show();
                $scope.produtos_1 = [];
                $scope.produtos_2 = [];
                $scope.produtos_3 = [];
                $scope.produto_valor = null;
                $scope.id_pai_selecionado = 0;
                $scope.ativos = {
                    produtos_1: 1,
                    produtos_2: 0,
                    produtos_3: 0
                };
                $scope.titulos = null;
                $scope.bt_voltar = 0;
                $scope.busca = function (id_pai, seq, valores) {
                    ExtraModuloFactory.clear($scope);
                    $ionicScrollDelegate.scrollTop();
                    LoadModuloFactory.show();
                    $scope.produtos_1 = [];
                    $scope.produtos_2 = [];
                    $scope.produtos_3 = [];

                    $scope.ativos = {
                        produtos_1: 0,
                        produtos_2: 0,
                        produtos_3: 0
                    };
                    $scope.ativos["produtos_" + seq] = 1;

                    if (id_pai > 0) {
                        ProdutosTable.get('id', id_pai, function (ret) {
                            $scope.titulos = ret.nome;
                        });
                    }
                    if (valores !== true) {
                        $scope.id_pai_selecionado = id_pai;
                        ProdutosTable.all({
                            where: 'id_pai = ' + id_pai
                        }, function (ret) {

                            if (ret === null) {
                                ExtraModuloFactory.success($scope, 'Nenhum produto localizado.');
                            } else {
                                $scope["produtos_" + seq] = ret;
                            }
                            LoadModuloFactory.hide();
                        });
                    } else {
                        ProdutosTable.all({
                            from: 'p.*, coalesce(pc.valor, "") as valor',
                            alias: 'p',
                            where: 'id_pai = ' + id_pai,
                            join: 'LEFT JOIN produtos_clientes AS pc ON (pc.produto_id = p.id AND pc.cliente_id = ' + $scope.cliente.id + ')'
                        }, function (ret) {
                            if (ret === null) {
                                $scope._buscaProduto(id_pai, seq);
                            } else {
                                angular.forEach(ret, function (v, k) {
                                    //v.valor = $filter('inputMoeda')(parseFloat(v.valor));
                                    v.produto_valor = v.valor;
                                    $scope["produtos_" + seq].push(v);
                                });
                                LoadModuloFactory.hide();
                            }

                        });
                    }
                };

                $scope.convertNumber = function (value, valor) {
                    return $filter('inputMoeda')(parseFloat(valor));
                }

                $scope._buscaProduto = function (id_pai, seq) {
                    ExtraModuloFactory.clear($scope);
                    ProdutosTable.all({
                        from: 'p.*',
                        alias: 'p',
                        where: 'id_pai = ' + id_pai
                    }, function (ret) {
                        if (ret === null) {
                            ExtraModuloFactory.info($scope, 'Nenhum produto localizado.');
                        } else {
                            angular.forEach(ret, function (v, k) {
                                //v.valor = $filter('inputMoeda')(parseFloat(v.valor));
                                v.produto_valor = v.valor;
                                $scope["produtos_" + seq].push(v);
                            });
                        }
                        LoadModuloFactory.hide();
                        $ionicScrollDelegate.scrollTop();
                    });
                }

                $scope.busca(0, 1, false);

                $scope.atualizar = function (produto) {
                    var produto_valor = $filter('inputMoeda')(produto.produto_valor);
                    produto.valor = produto.produto_valor = produto_valor;
                    var _save = {
                        cliente_id: 0,
                        produto_id: produto.id,
                        valor: produto.produto_valor,
                        status: 1,
                        modified: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                        created: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    };
                    _save.cliente_id = $scope.cliente.id;

                    ProdutosClientesTable.first(
                            {where: 'cliente_id = ' + $scope.cliente.id + ' AND produto_id = ' + produto.id}
                    , function (resp) {
                        if (resp === null) {
                            var save = angular.merge({}, _save);
                            ProdutosClientesTable.insert(save, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                            });
                        } else {
                            var save = angular.merge({}, resp, _save);
                            ProdutosClientesTable.update(save, resp.id, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                            });
                        }
                    });
                };

                $scope.salvar = function () {
                    ExtraModuloFactory.success($scope, 'Dados salvos com sucesso.');
                    $ionicScrollDelegate.scrollTop();
                }

                $scope.color = function (key) {
                    return ExtraModuloFactory.color(key);
                };

                /*$scope.concluir = function () {
                    ValidacaoModuloFactory.alert('Rota BAM finalizada com sucesso.');
                    $timeout(function () {
                        $state.go('app.cliente', {id: $scope.cliente.id});
                        //NavegacaoModuloFactory.go('app.cliente/' + $scope.cliente.id);
                    }, 3000);
                }*/

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
