angular.module('starter')

        .controller('ProgramaMercadoResumoCtrl', function (ExtraModuloFactory, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                LoadModuloFactory.show();

                $scope.formularios_respostas = [];
                var _formularios_respostas = [];

                var loadRespostas = function () {
                    FormulariosTable.all({
                        where: ' status = 1 AND tipo = 2'
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
                                $scope.formularios_respostas = [];
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
                }

                loadRespostas();

                $scope.confirmar = function () {
                    ValidacaoModuloFactory.confirm('Confirma a conclusão do Programa de Mercado', {
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
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.programaMercado);
                        }
                    });
                };

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
