angular.module('starter')

        .controller('RotaBamResumoCtrl', function (FileModuloFactory, NavegacaoModuloFactory, $scope, $rootScope, moment, StorageModuloFactory, ValidacaoModuloFactory,
                FotosCamerasTable, FormulariosTable, FormulariosGruposTable, LoadModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                LoadModuloFactory.show();

                $scope.formularios = [];

                var loadRespostas = function () {
                    FormulariosTable.all({
                        where: ' status = 1 AND (sub_formulario_id = 1 OR id = 1)'
                    }, function (ret) {
                        angular.forEach(ret, function (v, k) {
                            FormulariosGruposTable.all({
                                from: 'fc.*, fg.nome AS fg_nome, fg.id AS fg_id, fcv.id AS fcv_id, fcv.value AS fcv_resposta',
                                alias: 'fg',
                                where: 'fg.formulario_id = ' + v.id,
                                join: 'INNER JOIN formularios_grupos_campos AS fgc ON fgc.formularios_grupo_id = fg.id\n\
                                        INNER JOIN formularios_campos AS fc ON (fgc.formularios_campo_id = fc.id AND fc.status = 1)\n\
                                        INNER JOIN formularios_campos_valores AS fcv ON (fcv.formularios_campo_id = fc.id AND fcv.cliente_id = ' + $scope.cliente.id + ' )',
                                order: 'fc.ordem ASC'
                            }, function (retGrupo) {
                                angular.forEach(retGrupo, function (v1, k1) {
                                    v1 = angular.merge({imagens: []}, v1);
                                    FotosCamerasTable.all({where: 'tabela="FormulariosCamposValoresTable" AND id_referencia=' + v1.fcv_id}, function (retornoFotosCameras) {
                                        if (retornoFotosCameras !== null) {
                                            angular.forEach(retornoFotosCameras, function (value, key) {
                                                v1.imagens.push(value.imagem);
                                            });
                                            $scope.formularios.push(v1);
                                        } else {
                                            $scope.formularios.push(v1);
                                        }
                                    });
                                });
                            });
                        });
                        LoadModuloFactory.hide();
                    });
                }

                loadRespostas();

                $scope.urlForImage = function (value) {
                    FileModuloFactory.asUrl(value.image, function (r) {
                        value.image = r;
                    })
                }

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
