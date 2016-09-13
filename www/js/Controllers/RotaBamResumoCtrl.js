angular.module('starter')

        .controller('RotaBamResumoCtrl', function (CheckinTable, moment, ExtraModuloFactory, ProdutosClientesTable, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                LoadModuloFactory.show();

                $scope.formularios_respostas = [];
                var _formularios_respostas = [];
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
                                    $scope.formularios_respostas.push({
                                        nome: v1.nome,
                                        subtitulo: v1.subtitulo,
                                        fcv_resposta: v1.fcv_resposta
                                    });
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
                        where: 'pc.cliente_id = ' + $scope.cliente.id + ' AND (pc.valor is not null OR pc.valor != "" OR pc.valor != "0.00")',
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
                            CheckinTable.insert({
                                usuario_id: null,
                                cliente_id: $scope.cliente.id,
                                status: 1,
                                tipo: 'Rota BAM',
                                data: moment(new Date).format('YYYY-MM-DD'),
                                latitude: null,
                                longitude: null,
                                modified: moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
                                created: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                            }, function (a) {
                                StorageModuloFactory.setFlash('Rota BAM realizada com sucesso. Realize a Sincronização de dados através do Menu lateral');
                                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.cliente, {id: $scope.cliente.id});
                            });
                        } else {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.rotaBam);
                        }
                    });
                };

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
