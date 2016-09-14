angular.module('starter')

        .controller('ProgramaMercadoResumoCtrl', function (CheckinTable, moment, ExtraModuloFactory, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, ValidacaoModuloFactory,
                FormulariosTable, FormulariosCamposValoresTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

                LoadModuloFactory.show();

                $scope.formularios_respostas = [];

                var loadRespostas = function () {
                    $scope.formularios_respostas = [];
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

                                angular.forEach(retGrupo, function (v1, k1) {
                                    listasFotos(v1);
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
                            CheckinTable.insert({
                                usuario_id: null,
                                cliente_id: $scope.cliente.id,
                                status: 1,
                                tipo: 'Programa de Mercado - RAC',
                                data: moment(new Date).format('YYYY-MM-DD'),
                                latitude: null,
                                longitude: null,
                                modified: moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
                                created: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                            }, function (a) {
                                StorageModuloFactory.setFlash('Programa de Mercado - RAC realizada com sucesso. Realize a Sincronização de dados através do Menu lateral');
                                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.cliente, {id: $scope.cliente.id});
                            });
                        } else {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.programaMercado);
                        }
                    });
                };

                var listasFotos = function (value) {
                    LoadModuloFactory.show();
                    console.log('----------');
                    console.log('lista');
                    console.log(JSON.stringify(value));
                    value = angular.merge({imagens: []}, value);
                    console.log(JSON.stringify(value));
                    FotosCamerasTable.all({where: 'tabela = "FormulariosCamposValoresTable" AND id_referencia = ' + value.fcv_id}, function (ret) {
                        console.log('lista dados imagens');
                        console.log(JSON.stringify(ret));
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
                    console.log('lista com passagem de imagens');
                    console.log(JSON.stringify(value));
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
