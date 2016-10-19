angular.module('starter')

        .controller('UploadCtrl', function ($rootScope, LoadModuloFactory, $timeout, moment, FileModuloFactory, FormulariosCamposValoresApiFactory,
                $scope, ValidacaoModuloFactory, StorageModuloFactory, FormulariosCamposValoresTable, CheckinTable, ProdutosClientesApiFactory,
                ProdutosClientesTable, NavegacaoModuloFactory, Ativacao52Table, Ativacao52ApiFactory, FotosCamerasTable, ClientesTable,
                ClientesApiFactory, CheckinApiFactory, OcorrenciasTable, OcorrenciasApiFactory, UsuariosApiFactory, Config) {

            //LoadModuloFactory.show();

            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            $scope._sincronizacao = {
                geral: {
                    enviado: 0,
                    atualizado: 0
                }
            };

            $scope.sincronizacao = {
                clientes: {
                    nome: 'Clientes',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                clientes_fotos: {
                    nome: 'Clientes Fotos',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                ocorrencias: {
                    nome: 'Ocorrência',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                produtos_clientes: {
                    nome: 'Produtos Clientes',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                formularios_campos_valores: {
                    nome: 'Formularios Campos Valores',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                ativacao_52: {
                    nome: 'Ativação 52 semanas',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                },
                checkin: {
                    nome: 'Checkin Realizados',
                    enviado: 0,
                    erros: 0,
                    atualizado: 0,
                    start: false
                }
            };

            var convertData = function (data) {
                return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            };




            var processaDados = function () {

                UsuariosApiFactory.edit($scope.user.id, $scope.user, function (e) {
                    $scope._sincronizacao.geral.enviado++;
                    FotosCamerasTable.all({where: 'tabela="UsuariosTable"'}, function (retornoFotosCameras) {
                        if (retornoFotosCameras !== null) {
                            angular.forEach(retornoFotosCameras, function (value, key) {
                                UsuariosApiFactory.uploadImage($scope.user.id, value.imagem, function (ret) {
                                    FotosCamerasTable.delete('id', value.id, function (retornoFotos) {
                                        $scope._sincronizacao.geral.atualizado++;
                                    });
                                });
                            });
                        } else {
                            $scope._sincronizacao.geral.atualizado++;
                        }
                    });
                });

                var _ocorrencias = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.ocorrencias.enviado++;
                        OcorrenciasApiFactory.add(
                                {
                                    cliente_id: v.cliente_id,
                                    usuario_id: v.usuario_id,
                                    descricao: v.descricao,
                                    id_pai: 0,
                                    tipo: null,
                                    tabela: null,
                                    id_referencia: null,
                                    modified: convertData(new Date()),
                                    created: convertData(new Date())
                                }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                OcorrenciasTable.delete('id', v.id, function (exc) {
                                    $scope.sincronizacao.ocorrencias.atualizado++;
                                    $scope._sincronizacao.geral.atualizado++;
                                });
                            } else {
                                $scope.sincronizacao.ocorrencias.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });
                }

                OcorrenciasTable.all({}, function (dados) {
                    $scope.sincronizacao.ocorrencias.start = true;
                    if (dados !== null) {
                        _ocorrencias(dados);
                    }
                });

                var _ativavao52semanas = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.ativacao_52.enviado++;
                        Ativacao52ApiFactory.add({
                            evento: v.evento,
                            descricao: v.descricao,
                            data: v.data,
                            local: v.local,
                            cliente_id: v.cliente_id,
                            usuario_id: v.usuario_id,
                            modified: convertData(new Date()),
                            created: convertData(new Date())
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                FotosCamerasTable.all({where: 'tabela="Ativacao52Table" AND id_referencia=' + v.id}, function (retornoFotosCameras) {
                                    if (retornoFotosCameras !== null) {
                                        angular.forEach(retornoFotosCameras, function (value, key) {
                                            FileModuloFactory.upload('ativacao52/upload.json', value.imagem, {params: {id: retorno.data.response.result.id}}, function (ret) {
                                                FileModuloFactory.remove(value.imagem, function (removeRetorno) {
                                                    FotosCamerasTable.delete('id', value.id, function (retornoFotos) {
                                                    });
                                                });
                                            });
                                        });
                                        Ativacao52Table.delete('id', v.id, function (exc) {
                                            $scope.sincronizacao.ativacao_52.atualizado++;
                                            $scope._sincronizacao.geral.atualizado++;
                                        });
                                    } else {
                                        Ativacao52Table.delete('id', v.id, function (exc) {
                                            $scope.sincronizacao.ativacao_52.atualizado++;
                                            $scope._sincronizacao.geral.atualizado++;
                                        });
                                    }
                                });
                            } else {
                                $scope.sincronizacao.ativacao_52.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });
                }

                Ativacao52Table.all({}, function (dados) {
                    $scope.sincronizacao.ativacao_52.start = true;
                    if (dados !== null) {
                        _ativavao52semanas(dados);
                    }
                });

                var _formulariosCamposValores = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.formularios_campos_valores.enviado++;
                        FormulariosCamposValoresApiFactory.add({
                            formulario_id: v.formulario_id,
                            formularios_campo_id: v.formularios_campo_id,
                            value: v.value,
                            cliente_id: v.cliente_id,
                            usuario_id: v.usuario_id,
                            imagem: null,
                            status: v.status,
                            modified: convertData(new Date()),
                            created: convertData(new Date())
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                FotosCamerasTable.all({where: 'tabela="FormulariosCamposValoresTable" AND id_referencia=' + v.id}, function (retornoFotosCameras) {
                                    if (retornoFotosCameras !== null) {
                                        angular.forEach(retornoFotosCameras, function (value, key) {
                                            FileModuloFactory.upload('formularios-campos-valores/upload.json', value.imagem, {params: {id: retorno.data.response.result.id}}, function (ret) {
                                                FileModuloFactory.remove(value.imagem, function (removeRetorno) {
                                                    FotosCamerasTable.delete('id', value.id, function (retornoFotos) {
                                                    });
                                                });
                                            });
                                        });
                                        FormulariosCamposValoresTable.delete('id', v.id, function (exc) {
                                            $scope.sincronizacao.formularios_campos_valores.atualizado++;
                                            $scope._sincronizacao.geral.atualizado++;
                                        });
                                    } else {
                                        FormulariosCamposValoresTable.delete('id', v.id, function (exc) {
                                            $scope.sincronizacao.formularios_campos_valores.atualizado++;
                                            $scope._sincronizacao.geral.atualizado++;
                                        });
                                    }
                                });
                            } else {
                                $scope.sincronizacao.formularios_campos_valores.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });

                }

                FormulariosCamposValoresTable.all({}, function (dados) {
                    $scope.sincronizacao.formularios_campos_valores.start = true;
                    if (dados !== null) {
                        _formulariosCamposValores(dados);
                    }
                });

                var _produtosClientes = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.produtos_clientes.enviado++;
                        ProdutosClientesApiFactory.add({
                            cliente_id: v.cliente_id,
                            usuario_id: $scope.user.id,
                            produto_id: v.produto_id,
                            status: v.status,
                            valor: v.valor,
                            modified: convertData(new Date()),
                            created: convertData(new Date())
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                ProdutosClientesTable.update({status: 2}, v.id, function (exc) {
                                    $scope.sincronizacao.produtos_clientes.atualizado++;
                                    $scope._sincronizacao.geral.atualizado++;
                                });
                            } else {
                                $scope.sincronizacao.produtos_clientes.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });
                }

                ProdutosClientesTable.all({where: 'status != 2'}, function (dados) {
                    $scope.sincronizacao.produtos_clientes.start = true;
                    if (dados !== null) {
                        _produtosClientes(dados);
                    }
                });

                var _checkin = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.checkin.enviado++;
                        CheckinApiFactory.add({
                            usuario_id: v.usuario_id,
                            cliente_id: v.cliente_id,
                            status: v.status,
                            tipo: v.tipo,
                            data: moment(new Date()).format('YYYY-MM-DD'),
                            latitude: v.latitude,
                            longitude: v.longitude,
                            modified: convertData(new Date()),
                            created: convertData(new Date())
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                CheckinTable.delete('id', v.id, function (exc) {
                                    $scope.sincronizacao.checkin.atualizado++;
                                    $scope._sincronizacao.geral.atualizado++;
                                });
                            } else {
                                $scope.sincronizacao.checkin.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });
                }

                CheckinTable.all({}, function (dados) {
                    $scope.sincronizacao.checkin.start = true;
                    if (dados !== null) {
                        _checkin(dados);
                    }
                });

                var _clientes = function (dados) {
                    angular.forEach(dados, function (v, k) {
                        $scope.sincronizacao.clientes.enviado++;
                        $scope._sincronizacao.geral.enviado++;
                        ClientesApiFactory.edit(v.id_integracao, {
                            id: v.id_integracao,
                            nome: v.nome,
                            latitude: v.latitude,
                            longitude: v.longitude,
                            cep: v.cep,
                            endereco: v.endereco,
                            numero: v.numero,
                            complemento: v.complemento,
                            bairro: v.bairro
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                v.status = 1;
                                ClientesTable.update({
                                    status: 1
                                            //foto: null
                                }, v.id_integracao, function (exc) {
                                    $scope.sincronizacao.clientes.atualizado++;
                                    $scope._sincronizacao.geral.atualizado++;
                                });
                            } else {
                                $scope.sincronizacao.clientes.erros++;
                                $scope._sincronizacao.geral.atualizado++;
                            }
                        });
                    });
                };

                ClientesTable.all({where: 'status > 1', from: 'id_integracao, nome, latitude, longitude, cep, endereco, numero, complemento, bairro, status'}, function (dados) {
                    $scope.sincronizacao.clientes.start = true;
                    if (dados !== null) {
                        _clientes(dados);
                    }
                });

                FotosCamerasTable.all({where: 'tabela="ClientesTable"'}, function (retornoFotosCameras) {
                    $scope.sincronizacao.clientes_fotos.start = true;
                    if (retornoFotosCameras !== null) {
                        angular.forEach(retornoFotosCameras, function (value, key) {
                            console.log('Listage de fotos do cliente');
                            console.log(JSON.stringify(value));
                            FileModuloFactory.upload('clientes/upload.json', value.imagem, {params: {id: value.id_referencia}}, function (ret) {
                                $scope.sincronizacao.clientes_fotos.enviado++;
                                $scope._sincronizacao.geral.enviado++;
                                FileModuloFactory.remove(value.imagem, function (removeRetorno) {
                                    FotosCamerasTable.delete('id', value.id, function (retornoFotos) {
                                        $scope.sincronizacao.clientes_fotos.atualizado++;
                                        $scope._sincronizacao.geral.atualizado++;
                                    });
                                });
                            });
                        });
                    }
                });

            }

            var retornoLogin = function (retorno) {
                if (ValidacaoModuloFactory.is('OK', retorno.status)) {
                    retorno.data.response.result.senha = $scope.user.senha;
                    $rootScope.setAtualizarUser(retorno.data.response.result);
                    processaDados();
                } else {
                    ValidacaoModuloFactory.alert('Não foi possivel fazer o login tente novamente.');
                }
            };

            UsuariosApiFactory.validaLogin({login: $scope.user.login, id: $scope.user.id}, retornoLogin);
            $scope._atualizar = function () {
                $timeout(function () {
                    $scope._hide();

                }, 5000);
            };

            $scope._atualizar();

            $scope._hide = function () {
                if ($scope.sincronizacao.ativacao_52.start === true && $scope.sincronizacao.checkin.start === true && $scope.sincronizacao.clientes.start === true && $scope.sincronizacao.clientes_fotos.start === true && $scope.sincronizacao.produtos_clientes.start === true && $scope.sincronizacao.formularios_campos_valores.start === true && $scope._sincronizacao.geral.atualizado >= $scope._sincronizacao.geral.enviado) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 0);
                    //LoadModuloFactory.hide();
                    if (StorageModuloFactory.local.get(StorageModuloFactory.enum.forceLogoutSincronizacao) > 0) {
                        StorageModuloFactory.local.set(StorageModuloFactory.enum.forceLogoutSincronizacao, 0);
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.logout);
                    } else {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.inicializacao);
                    }
                } else {
                    $scope._atualizar();
                }
            };


        });
