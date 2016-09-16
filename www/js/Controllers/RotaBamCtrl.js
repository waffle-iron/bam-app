angular.module('starter')

        .controller('RotaBamCtrl', function ($ionicScrollDelegate, CameraModuloFactory, ExtraModuloFactory, $scope, $rootScope, moment, StorageModuloFactory,
                FotosCamerasTable, FormulariosTable, FormulariosGruposTable, FormulariosCamposValoresTable, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                LoadModuloFactory.show();
                var ignorado = null;

                $scope.formularios = [];
                $scope.qtd_btn_camera = [];
                $scope.btn_camera = 0;
                $scope.btn_camera_complete = 0;
                $scope.valor_selecionado = null;
                $scope.id_resposta = null;
                $scope.perguntas = {
                    atual: 0,
                    sequencia: 0,
                    total: 0
                };

                $scope.getSubFormulario = function (argumento, redireciona) {
                    if (!ValidacaoModuloFactory.empty(argumento.valor)) {
                        LoadModuloFactory.show();
                        FormulariosTable.all({
                            where: 'status = 1 AND sub_formulario_id = ' + argumento.formulario_id + ' AND argumento="' + ValidacaoModuloFactory.trim(argumento.valor) + '" AND formularios_pergunta_id = ' + argumento.id + ''
                        }, function (ret) {
                            if (ret !== null) {
                                angular.forEach(ret, function (v, k) {
                                    FormulariosGruposTable.all({
                                        from: 'fc.*, fg.nome AS fg_nome, fg.id AS fg_id',
                                        alias: 'fg',
                                        where: 'fg.formulario_id = ' + v.id,
                                        join: 'INNER JOIN formularios_grupos_campos AS fgc ON fgc.formularios_grupo_id = fg.id\n\
                                               INNER JOIN formularios_campos AS fc ON fgc.formularios_campo_id = fc.id AND fc.status = 1',
                                        order: 'fc.ordem ASC'
                                    }, function (retGrupo) {
                                        angular.forEach(retGrupo, function (v1, k1) {
                                            $scope.perguntas.total++;
                                            v1 = angular.merge({
                                                sequencia: $scope.perguntas.sequencia
                                            }, v1);
                                            $scope.perguntas.sequencia++;
                                            if (ValidacaoModuloFactory.isNotNull(v1.opcoes)) {
                                                v1.opcoes = v1.opcoes.split(',');
                                            }
                                            $scope.formularios.push(v1);

                                        });
                                        LoadModuloFactory.hide();
                                        redireciona();

                                    });
                                });

                            } else {
                                LoadModuloFactory.hide();
                                redireciona();
                            }
                        });
                    } else {
                        redireciona();
                    }
                }

                FormulariosTable.all({
                    where: 'status = 1 AND tipo = 1 AND (sub_formulario_id is null OR sub_formulario_id = 0)'
                }, function (ret) {
                    if (ret === null) {
                        ExtraModuloFactory.error($scope, 'Nenhuma ocorrência localizada.');
                    } else {
                        angular.forEach(ret, function (v, k) {
                            FormulariosGruposTable.all({
                                from: 'fc.*, fg.nome AS fg_nome, fg.id AS fg_id',
                                alias: 'fg',
                                where: 'fg.formulario_id = ' + v.id,
                                join: 'INNER JOIN formularios_grupos_campos AS fgc ON fgc.formularios_grupo_id = fg.id\n\
                                       INNER JOIN formularios_campos AS fc ON fgc.formularios_campo_id = fc.id AND fc.status = 1',
                                order: 'fc.ordem ASC'
                            }, function (retGrupo) {
                                angular.forEach(retGrupo, function (v1, k1) {
                                    $scope.perguntas.total++;
                                    v1 = angular.merge({
                                        sequencia: $scope.perguntas.sequencia
                                    }, v1);
                                    $scope.perguntas.sequencia++;
                                    if (ValidacaoModuloFactory.isNotNull(v1.opcoes)) {
                                        v1.opcoes = v1.opcoes.split(',');
                                    }
                                    $scope.formularios.push(v1);

                                });
                                LoadModuloFactory.hide();
                            });
                        });

                    }
                });

                $scope.color = function (key) {
                    return ExtraModuloFactory.color(key);
                };

                $scope.sequencia = function (dados, key) {
                    $scope.valor_selecionado = '';
                    if ($scope.perguntas.atual >= $scope.perguntas.total) {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.cervejas);
                    }
                    if (ignorado === dados.id) {
                        $scope.perguntas.atual++;
                        ignorado = null;
                        return ((dados.sequencia + 1) === $scope.perguntas.atual ? 1 : 0);
                    } else {
                        return (dados.sequencia === $scope.perguntas.atual ? 1 : 0);
                    }
                };

                $scope.proximo = function (dados, key) {
                    ExtraModuloFactory.clear($scope);
                    if ($scope.btn_camera > 0) {
                        ValidacaoModuloFactory.alert('Foto obrigatoria.');
                    } else {
                        if (dados.required > 0) {
                            if (!ValidacaoModuloFactory.empty(dados.valor)) {
                                $scope.getSubFormulario(dados, function () {
                                    $scope.btn_camera = 0;
                                    $scope.valor_selecionado = null;
                                    $scope.perguntas.atual++;
                                    $scope.sequencia(dados, key);
                                });
                            } else {
                                ValidacaoModuloFactory.alert('Informe uma resposta.');
                            }
                        } else {
                            $scope.getSubFormulario(dados, function () {
                                $scope.btn_camera = 0;
                                $scope.valor_selecionado = null;
                                $scope.perguntas.atual++;
                                $scope.sequencia(dados, key);
                            });
                        }
                    }
                };

                $scope.atualizar = function (dados, valor_selecionado, sequencia_dados) {
                    $scope.btn_camera = 0;
                    $scope.valor_selecionado = valor_selecionado;
                    if (angular.isNumber(sequencia_dados)) {
                        LoadModuloFactory.show();
                        dados.valor = dados.opcoes[sequencia_dados];
                    } else {
                        dados.valor = valor_selecionado;
                    }
                    dados.valor = ValidacaoModuloFactory.trim(dados.valor);

                    var dados_save = {
                        formulario_id: dados.formulario_id,
                        formularios_campo_id: dados.id,
                        value: dados.valor,
                        cliente_id: $scope.cliente.id,
                        usuario_id: $scope.user.id,
                        status: 1,
                        imagem: null,
                        created: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                        modified: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    };

                    FormulariosCamposValoresTable.first(
                            {where: 'cliente_id = ' + $scope.cliente.id + ' AND formularios_campo_id = ' + dados.id}
                    , function (resp) {
                        if (resp === null) {
                            var ssss = angular.merge({}, dados_save);
                            FormulariosCamposValoresTable.insert(ssss, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                                saveResposta(a, dados);
                            });
                        } else {
                            var ssss = angular.merge({}, resp, dados_save);
                            FormulariosCamposValoresTable.update(ssss, resp.id, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                                saveResposta(a, dados);
                            });
                        }

                    });

                };

                var saveResposta = function (a, dados) {
                    ignorado = null;
                    if (dados.tipo === 'radio' && dados.valor != dados.value && dados.atributos > 0) {
                        ignorado = parseInt(dados.atributos);
                    }
                    $scope.id_resposta = a.id;

                    $scope.btn_camera = 0;
                    $scope.btn_camera_complete = 0;
                    $scope.qtd_btn_camera = [];
                    if (dados.value == dados.valor) {
                        $scope.btn_camera = dados.contem_imagem;
                        for (var i = 1; i <= dados.contem_imagem; i++) {
                            $scope.qtd_btn_camera.push({
                                seq_foto: i,
                                tirado: null
                            });
                        }
                    } else if (dados.contem_imagem > 0 && !ValidacaoModuloFactory.isNotNull(dados.value)) {
                        $scope.btn_camera = dados.contem_imagem;
                        for (var i = 1; i <= dados.contem_imagem; i++) {
                            $scope.qtd_btn_camera.push({
                                seq_foto: i,
                                tirado: null
                            });
                        }
                    } else {
                        $scope.btn_camera = 0;
                    }
                    LoadModuloFactory.hide();
                }

                $scope.tirarFoto = function (value, valueFoto, index) {
                    CameraModuloFactory.capturarFotoFile(function (img) {
                        LoadModuloFactory.show();
                        if (img !== null) {
                            FotosCamerasTable.save({
                                tabela: 'FormulariosCamposValoresTable',
                                id_referencia: $scope.id_resposta,
                                sequencia: valueFoto.seq_foto,
                                imagem: img
                            }, function (retorno) {
                                $scope.qtd_btn_camera[index].tirado = 'fa fa-check-square-o';
                                $scope.btn_camera_complete++;
                                if ($scope.btn_camera_complete === $scope.btn_camera) {
                                    $scope.btn_camera = 0;
                                    ExtraModuloFactory.success($scope, 'Todas as fotos já tiradas.');
                                    ExtraModuloFactory.top();
                                }
                                LoadModuloFactory.hide();
                            });
                        } else {
                            LoadModuloFactory.hide();
                        }
                    });
                }

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
