angular.module('starter')

        .controller('RotaBamResumoCtrl', function (ExtraModuloFactory, ProdutosClientesTable, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                LoadModuloFactory.show();

                $scope.formularios_respostas = [];
                var _formularios_respostas = [];
                $scope.cervejas = [];


                var loadRespostas = function () {
                    FormulariosTable.all({
                        where: ' status = 1 AND tipo = 1'
                    }, function (ret) {
                        angular.forEach(ret, function (v, k) {
                            FormulariosCamposValoresTable.all({
                                from: 'fc.*, ftc.*, fcv.id AS fcv_id, fcv.value AS fcv_resposta',
                                alias: 'fcv',
                                where: 'fcv.formulario_id = ' + v.id + ' AND fcv.cliente_id = ' + $scope.cliente.id,
                                join: 'INNER JOIN formularios_campos AS fc ON fc.id = fcv.formularios_campo_id\n\
                                       LEFT JOIN fotos_cameras as ftc on ftc.id_referencia = fcv.id',
                                order: 'fc.ordem ASC',
                                group: 'fcv.formularios_campo_id'
                            }, function (retGrupo) {
                                $scope.formularios_respostas = [];
                                angular.forEach(retGrupo, function (v1, k1) {
                                    if (!ValidacaoModuloFactory.isNotNull(_formularios_respostas[v1.fcv_id])) {
                                        _formularios_respostas[v1.fcv_id] = [];
                                        _formularios_respostas[v1.fcv_id]['nome'] = v1.nome;
                                        _formularios_respostas[v1.fcv_id]['subtitulo'] = v1.subtitulo;
                                        _formularios_respostas[v1.fcv_id]['fcv_resposta'] = v1.fcv_resposta;
                                        _formularios_respostas[v1.fcv_id]['imagem'] = [];
                                    }
                                    if (ValidacaoModuloFactory.isNotNull(v1.imagem)) {
                                        _formularios_respostas[v1.fcv_id]['imagem'].push(v1.imagem);
                                    }

                                });
                                angular.forEach(_formularios_respostas, function (v1, k1) {
                                    $scope.formularios_respostas.push(v1);
                                });
                                console.log($scope.formularios_respostas);
                                ExtraModuloFactory.top();
                                LoadModuloFactory.hide();

                            });
                        });
                    });

                    LoadModuloFactory.show();
                    ProdutosClientesTable.all({
                        from: '*',
                        alias: 'pc',
                        where: 'pc.cliente_id = ' + $scope.cliente.id + ' AND (pc.valor is not null OR pc.valor != "")',
                        join: 'INNER JOIN produtos AS p ON p.id = pc.produto_id'
                    }, function (ret) {
                        $scope.cervejas = [];
                        $scope.cervejas = ret;
                        LoadModuloFactory.hide();
                    });

                    LoadModuloFactory.hide();
                };

                loadRespostas();

                $scope.confirmar = function () {
                    ValidacaoModuloFactory.confirm('Confirma a conclusão da Rota BAM', {
                        btOk: {
                            text: '<b>Sim</b>'
                        },
                        btCancel: {
                            text: '<b>Não</b>'
                        }
                    }, function (retorno, sucesso) {
                        if (sucesso === true) {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.cliente, {id: $scope.cliente.id});
                        } else {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.rotaBam);
                        }
                    });
                };

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
