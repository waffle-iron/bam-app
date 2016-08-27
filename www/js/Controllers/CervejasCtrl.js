angular.module('starter')

        .controller('CervejasCtrl', function ($filter, $state, $timeout, $ionicScrollDelegate, ExtraModuloFactory, $scope, $rootScope, moment, StorageModuloFactory, ProdutosTable, ProdutosClientesTable, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                LoadModuloFactory.show();
                $scope.produtos_1 = [];
                $scope.produtos_2 = [];
                $scope.produtos_3 = [];
                $scope.produto_valor = null;
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
                                    v.valor = $filter('inputMoeda')(parseFloat(v.valor));
                                    $scope["produtos_" + seq].push(v);
                                });
                                LoadModuloFactory.hide();
                            }

                        });
                    }
                };

                $scope.convertNumber = function (value, valor) {
                    value.valor = parseInt(valor.toString().replace(',', '').replace('.', ''));
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
                                v.valor = $filter('inputMoeda')(parseFloat(v.valor));
                                $scope["produtos_" + seq].push(v);
                            });
                        }
                        LoadModuloFactory.hide();
                        $ionicScrollDelegate.scrollTop();
                    });
                }

                $scope.busca(0, 1, false);

                $scope.atualizar = function (produto, produto_valor) {
                    produto_valor = $filter('inputMoeda')(parseFloat(produto_valor));
                    produto.valor = produto_valor;
                    ProdutosClientesTable.first(
                            {where: 'cliente_id = ' + $scope.cliente.id + ' AND produto_id = ' + produto.id}
                    , function (resp) {

                        if (resp === null) {
                            resp = {};
                            resp.valor = produto_valor;
                            if (resp.valor > 0) {
                                resp.status = 1;
                            } else {
                                resp.status = 0;
                            }
                            resp.produto_id = produto.id;
                            resp.cliente_id = $scope.cliente.id;
                            resp.created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            ProdutosClientesTable.insert(resp, function (a) {
                            });
                        } else {
                            resp.valor = produto_valor;
                            if (resp.valor > 0) {
                                resp.status = 1;
                            } else {
                                resp.status = 0;
                            }
                            resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            ProdutosClientesTable.update(resp, resp.id, function (a) {
                            });
                        }
                    });
                    return produto;
                };

                $scope.salvar = function () {
                    ExtraModuloFactory.success($scope, 'Dados salvos com sucesso.');
                    $ionicScrollDelegate.scrollTop();
                }

                $scope.color = function (key) {
                    return ExtraModuloFactory.color(key);
                };

                $scope.concluir = function () {
                    ValidacaoModuloFactory.alert('Rota BAM finalizada com sucesso.');
                    $timeout(function () {
                        $state.go('app.cliente', {id: $scope.cliente.id});
                        //NavegacaoModuloFactory.go('app.cliente/' + $scope.cliente.id);
                    }, 3000);
                }

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
