angular.module('starter')

        .controller('ProgramaMercadoCtrl', function (CameraModuloFactory, ExtraModuloFactory, $scope, $rootScope, moment, StorageModuloFactory,
                FormulariosTable, FormulariosGruposTable, FormulariosCamposValoresTable, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory) {

            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                LoadModuloFactory.show();
                $scope.formularios = [];
                $scope.btn_camera = 0;
                $scope.valor_selecionado = null;
                $scope.id_resposta = null;
                $scope.perguntas = {
                    atual: 0,
                    sequencia: 0,
                    total: 0
                };

                $scope.getSubFormulario = function (argumento, pergunta_id, redireciona) {
                    if (!ValidacaoModuloFactory.empty(argumento)) {
                        LoadModuloFactory.show();
                        FormulariosTable.all({
                            where: 'status = 1 AND sub_formulario_id = 2 AND argumento="' + ValidacaoModuloFactory.trim(argumento) + '" AND formularios_pergunta_id = ' + pergunta_id + ''
                        }, function (ret) {
                            console.log(ret);
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
                    where: 'status = 1 AND tipo = 2 AND (sub_formulario_id is null OR sub_formulario_id = 0)'
                }, function (ret) {
                    if (ret === null) {
                        ExtraModuloFactory.console.error($scope, 'Nenhuma ocorrência localizada.');
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

                $scope.img = function (dados) {
                    return ExtraModuloFactory.img(dados);
                };

                $scope.sequencia = function (dados) {
                    if ($scope.perguntas.atual >= $scope.perguntas.total) {
                        ExtraModuloFactory.success($scope, 'Todas as perguntas já foram respondidas.');
                    }
                    return (dados.sequencia === $scope.perguntas.atual ? 1 : 0);
                };

                $scope.proximo = function (dados) {
                    if (dados.required > 0) {
                        if (!ValidacaoModuloFactory.empty(dados.valor)) {
                            $scope.getSubFormulario(dados.valor, dados.id, function () {
                                $scope.btn_camera = 0;
                                $scope.valor_selecionado = null;
                                $scope.perguntas.atual++;
                                $scope.sequencia(dados);
                            });
                        } else {
                            ValidacaoModuloFactory.alert('Informe uma resposta.');
                        }
                    } else {
                        $scope.getSubFormulario(dados.valor, dados.id, function () {
                            $scope.btn_camera = 0;
                            $scope.valor_selecionado = null;
                            $scope.perguntas.atual++;
                            $scope.sequencia(dados);
                        });
                    }
                };

                $scope.atualizar = function (dados, valor_selecionado, sequencia_dados) {
                    LoadModuloFactory.show();
                    $scope.valor_selecionado = valor_selecionado;
                    if (angular.isNumber(sequencia_dados)) {
                        dados.valor = dados.opcoes[sequencia_dados];
                    } else {
                        dados.valor = $scope.valor_selecionado;
                    }
                    dados.valor = ValidacaoModuloFactory.trim(dados.valor);
                    FormulariosCamposValoresTable.first(
                            {where: 'cliente_id = ' + $scope.cliente.id + ' AND formularios_campo_id = ' + dados.id + ' AND value = "' + dados.valor + '"'}
                    , function (resp) {
                        if (resp === null) {
                            resp = {};
                            resp.formulario_id = dados.formulario_id;
                            resp.formularios_campo_id = dados.id;
                            resp.value = dados.valor;
                            resp.cliente_id = $scope.cliente.id;
                            resp.usuario_id = $scope.user.id;
                            resp.status = 1;
                            resp.imagem = null;
                            resp.created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            FormulariosCamposValoresTable.insert(resp, function (a) {
                                $scope.id_resposta = a.id;
                                LoadModuloFactory.hide();
                                $scope.btn_camera = 0;
                                if (dados.value == dados.valor) {
                                    $scope.btn_camera = dados.contem_imagem;
                                }

                            });
                        } else {
                            resp.value = dados.valor;
                            resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            FormulariosCamposValoresTable.update(resp, resp.id, function (a) {
                                $scope.id_resposta = a.id;
                                LoadModuloFactory.hide();
                                $scope.btn_camera = 0;
                                if (dados.value == dados.valor) {
                                    $scope.btn_camera = dados.contem_imagem;
                                }
                            });
                        }

                    });

                };

                $scope.tirarFoto = function () {
                    CameraModuloFactory.capturarFoto(function (img) {
                        StorageModuloFactory.local.set('foto.' + $scope.id_resposta, img);
                    });
                }

            } else {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
