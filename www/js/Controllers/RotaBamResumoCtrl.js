angular.module('starter')

        .controller('RotaBamResumoCtrl', function (FileModuloFactory, FotosCamerasTable, CheckinTable, moment, ExtraModuloFactory, ProdutosClientesTable, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                LoadModuloFactory.show();

                $scope.formularios_respostas = [];
                $scope.cervejas = [];

                var loadRespostas = function () {
                    $scope.formularios_respostas = [];
                    FormulariosTable.all({
                        where: ' status = 1 AND tipo = 1'
                    }, function (ret) {
                        angular.forEach(ret, function (v, k) {
                            FormulariosCamposValoresTable.all({
                                from: 'fc.*, fcv.id AS fcv_id, fcv.value AS fcv_resposta',
                                alias: 'fcv',
                                where: 'fcv.formulario_id = ' + v.id + ' AND fcv.cliente_id = ' + $scope.cliente.id,
                                join: 'INNER JOIN formularios_campos AS fc ON fc.id = fcv.formularios_campo_id',
                                order: 'fc.ordem ASC',
                                group: 'fcv.formularios_campo_id'
                            }, function (retGrupo) {
                                angular.forEach(retGrupo, function (v1, k1) {
                                    listasFotos(v1);
                                });
                                ExtraModuloFactory.top();
                                LoadModuloFactory.hide();
                            });
                        });
                    });

                    LoadModuloFactory.show();
                    ProdutosClientesTable.all({
                        from: '*',
                        alias: 'pc',
                        where: 'pc.cliente_id = ' + $scope.cliente.id + ' AND pc.status != 2 AND (pc.valor is not null AND pc.valor != "" AND pc.valor != "0.00")',
                        join: 'INNER JOIN produtos AS p ON p.id = pc.produto_id'
                    }, function (ret) {
                        console.log('cervejas');
                        console.log(ret);
                        $scope.cervejas = [];
                        $scope.cervejas = ret;
                        LoadModuloFactory.hide();
                    });


                };

                loadRespostas();

                $scope.confirmar = function () {
                    LoadModuloFactory.show();
                    CheckinTable.save2({
                        usuario_id: $scope.user.id,
                        cliente_id: $scope.cliente.id,
                        status: 1,
                        tipo: 'Rota BAM',
                        data: moment(new Date).format('YYYY-MM-DD'),
                        latitude: StorageModuloFactory.local.get(StorageModuloFactory.enum.latitude, null),
                        longitude: StorageModuloFactory.local.get(StorageModuloFactory.enum.longitude, null),
                        modified: moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
                        created: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    }, function (a) {
                        LoadModuloFactory.hide();
                        StorageModuloFactory.setFlash('Rota BAM realizada com sucesso. Realize a Sincronização de dados através do Menu lateral');
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.cliente, {id: $scope.cliente.id});
                    });

                };

                var listasFotos = function (value) {
                    LoadModuloFactory.show();
                    value = angular.merge({imagens: []}, value);
                    FotosCamerasTable.all({where: 'tabela = "FormulariosCamposValoresTable" AND id_referencia = ' + value.fcv_id}, function (ret) {
                        if (ret !== null) {
                            var total = (ret.length - 1);
                            var i = 0;
                            angular.forEach(ret, function (v, k) {
                                FileModuloFactory.asUrl(v.imagem, function (retImagem) {
                                    i++;
                                    value.imagens.push({img: retImagem});
                                    if (total === i) {
                                        __saveFotoArray(value);
                                    }
                                });
                            });
                        } else {
                            __saveFotoArray(value);
                        }
                    });
                };

                var __saveFotoArray = function (value) {
                    $scope.formularios_respostas.push({
                        nome: value.nome,
                        subtitulo: value.subtitulo,
                        fcv_resposta: value.fcv_resposta,
                        imagens: value.imagens
                    });
                    LoadModuloFactory.hide();
                }

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
