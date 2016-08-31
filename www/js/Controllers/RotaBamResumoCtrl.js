angular.module('starter')

        .controller('RotaBamResumoCtrl', function (ProdutosClientesTable, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FotosCamerasTable, FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                $scope.formularios = [];
                $scope.cervejas = [];

                var loadRespostas = function () {
                    FormulariosTable.all({
                        where: ' status = 1 AND tipo = 1'
                    }, function (ret) {
                        angular.forEach(ret, function (v, k) {
                            FormulariosCamposValoresTable.all({
                                from: 'fc.*, fcv.id AS fcv_id, fcv.value AS fcv_resposta',
                                alias: 'fcv',
                                where: 'fcv.formulario_id = ' + v.id + ' AND fcv.cliente_id = ' + $scope.cliente.id,
                                join: 'INNER JOIN formularios_campos AS fc ON fc.id = fcv.formularios_campo_id',
                                order: 'fc.ordem ASC'
                            }, function (retGrupo) {
                                angular.forEach(retGrupo, function (v1, k1) {
                                    v1 = angular.merge({imagens: []}, v1);
                                    FotosCamerasTable.all({where: 'tabela="FormulariosCamposValoresTable" AND id_referencia=' + v1.fcv_id}, function (retornoFotosCameras) {
                                        if (retornoFotosCameras !== null) {
                                            angular.forEach(retornoFotosCameras, function (value, key) {
                                                v1.imagens.push({image: value.imagem});
                                            });
                                            $scope.formularios.push(v1);
                                        } else {
                                            $scope.formularios.push(v1);
                                        }
                                    });
                                });
                            });
                        });
                    });

                    ProdutosClientesTable.all({
                        from: '*',
                        alias: 'pc',
                        where: 'pc.cliente_id = ' + $scope.cliente.id,
                        join: 'INNER JOIN produtos AS p ON p.id = pc.produto_id'
                    }, function (ret) {
                        $scope.cervejas = ret;
                        console.log($scope.cervejas);
                    });
                }

                loadRespostas();

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
