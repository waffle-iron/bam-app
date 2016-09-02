angular.module('starter')

        .controller('UploadCtrl', function ($timeout, moment, FileModuloFactory, FormulariosCamposValoresApiFactory,
                $scope, ValidacaoModuloFactory, StorageModuloFactory,
                FormulariosCamposValoresTable, CheckinTable, ProdutosClientesApiFactory, ProdutosClientesTable,
                NavegacaoModuloFactory, Ativacao52Table, Ativacao52ApiFactory, FotosCamerasTable, ClientesTable,
                ClientesApiFactory, CheckinApiFactory, OcorrenciasTable, OcorrenciasApiFactory, UsuariosApiFactory) {

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
                    atualizado: 0,
                    start: false
                },
                ocorrencias: {
                    nome: 'Ocorrência',
                    enviado: 0,
                    atualizado: 0,
                    start: false
                },
                produtos_clientes: {
                    nome: 'Produtos Clientes',
                    enviado: 0,
                    atualizado: 0,
                    start: false
                },
                formularios_campos_valores: {
                    nome: 'Formularios Campos Valores',
                    enviado: 0,
                    atualizado: 0,
                    start: false
                },
                ativacao_52: {
                    nome: 'Ativação 52 semanas',
                    enviado: 0,
                    atualizado: 0,
                    start: false
                },
                checkin: {
                    nome: 'Checkin Realizados',
                    enviado: 0,
                    atualizado: 0,
                    start: false
                }
            };

            var convertData = function (data) {
                if (ValidacaoModuloFactory.isNotNull(data)) {
                    return moment(data).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                }
            };

            OcorrenciasTable.all({}, function (dados) {
                $scope.sincronizacao.ocorrencias.start = true;
                if (dados !== null) {
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
                                    modified: convertData(v.modified),
                                    created: convertData(v.created)
                                }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                $scope.sincronizacao.ocorrencias.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                OcorrenciasTable.delete('id', v.id, function (exc) {
                                });
                            }
                        });
                    });
                }
            });

            Ativacao52Table.all({}, function (dados) {
                $scope.sincronizacao.ativacao_52.start = true;
                if (dados !== null) {
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
                            created: convertData(v.created)
                        }, function (retorno) {
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                $scope.sincronizacao.ativacao_52.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                FotosCamerasTable.all({where: 'tabela="Ativacao52Table" AND id_referencia=' + v.id}, function (retornoFotosCameras) {
                                    if (retornoFotosCameras !== null) {
                                        angular.forEach(retornoFotosCameras, function (value, key) {
                                            console.log('Ativacao52Table');
                                            console.log(JSON.stringify(value));
                                            Ativacao52ApiFactory.uploadImage(v.id, value.imagem, function (ret) {
                                                console.log(JSON.stringify(ret));
                                                FotosCamerasTable.delete('id_referencia', v.id, function (retornoFotos) {
                                                });
                                            });
                                        });
                                    }
                                    Ativacao52Table.delete('id', v.id, function (exc) {
                                    });
                                });
                            }
                        });
                    });
                }
            });

            FormulariosCamposValoresTable.all({}, function (dados) {
                $scope.sincronizacao.formularios_campos_valores.start = true;
                if (dados !== null) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.formularios_campos_valores.enviado++;

                        var imagem = StorageModuloFactory.local.get('foto.' + v.id, null);

                        FormulariosCamposValoresApiFactory.add({
                            formulario_id: v.formulario_id,
                            formularios_campo_id: v.formularios_campo_id,
                            value: v.value,
                            cliente_id: v.cliente_id,
                            usuario_id: v.usuario_id,
                            imagem: imagem,
                            status: v.status,
                            modified: convertData(new Date()),
                            created: convertData(v.created)
                        }, function (retorno) {
                            $scope.sincronizacao.formularios_campos_valores.atualizado++;
                            $scope._sincronizacao.geral.atualizado++;
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {

                                FotosCamerasTable.all({where: 'tabela="FormulariosCamposValoresTable" AND id_referencia=' + v.id}, function (retornoFotosCameras) {
                                    if (retornoFotosCameras !== null) {
                                        angular.forEach(retornoFotosCameras, function (value, key) {
                                            console.log('FormulariosCamposValoresTable');
                                            console.log(JSON.stringify(value));
                                            FormulariosCamposValoresApiFactory.uploadImage(v.id, value.imagem, function (ret) {
                                                console.log(JSON.stringify(ret));
                                                FotosCamerasTable.delete('id_referencia', v.id, function (retornoFotos) {
                                                });
                                            });
                                        });

                                    }
                                });

                                FormulariosCamposValoresTable.delete('id', v.id, function (exc) {
                                });
                            }
                        });
                    });
                }

            });

            ProdutosClientesTable.all({where: 'status != 2'}, function (dados) {
                $scope.sincronizacao.produtos_clientes.start = true;
                if (dados !== null) {
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
                            created: convertData(v.created)
                        }, function (retorno) {
                            $scope.sincronizacao.produtos_clientes.atualizado++;
                            $scope._sincronizacao.geral.atualizado++;
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                ProdutosClientesTable.update({status: 2}, v.id, function (exc) {
                                });
                            }
                        });
                    });
                }

            });


            CheckinTable.all({}, function (dados) {
                $scope.sincronizacao.checkin.start = true;
                if (dados !== null) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.checkin.enviado++;
                        v.data = moment(new Date()).format('YYYY-MM-DD');
                        v.modified = convertData(new Date());
                        v.created = convertData(v.created);
                        CheckinApiFactory.add(v, function (retorno) {
                            $scope.sincronizacao.checkin.atualizado++;
                            $scope._sincronizacao.geral.atualizado++;
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                CheckinTable.delete('id', v.id, function (exc) {
                                });
                            }
                        });
                    });
                }

            });

            ClientesTable.all({where: 'status = 2'}, function (dados) {
                $scope.sincronizacao.clientes.start = true;
                if (dados !== null) {
                    angular.forEach(dados, function (v, k) {
                        $scope._sincronizacao.geral.enviado++;
                        $scope.sincronizacao.clientes.enviado++;
                        var _v = v;
                        _v.id = _v.id_integracao;
                        _v.status = 1;
                        _v.modified = convertData(new Date());
                        _v.created = convertData(_v.created);
                        delete v.url;
                        delete v.foto;
                        ClientesApiFactory.edit(v.id_integracao, _v, function (retorno) {
                            $scope.sincronizacao.clientes.atualizado++;
                            $scope._sincronizacao.geral.atualizado++;
                            if (ValidacaoModuloFactory.isOk(retorno.status)) {
                                _v.status = 1;
                                ClientesTable.replace(_v, function (exc) {
                                    FotosCamerasTable.all({where: 'tabela="ClientesTable" AND id_referencia=' + v.id}, function (retornoFotosCameras) {
                                        if (retornoFotosCameras !== null) {
                                            angular.forEach(retornoFotosCameras, function (value, key) {
                                                console.log('ClientesTable');
                                                console.log(JSON.stringify(value));
                                                ClientesApiFactory.uploadImage(v.id, value.imagem, function (ret) {
                                                    console.log(JSON.stringify(ret));
                                                    FotosCamerasTable.delete('id_referencia', v.id, function (retornoFotos) {
                                                    });
                                                });
                                            });

                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });

            UsuariosApiFactory.edit($scope.user.id, $scope.user, function (e) {
                $scope._sincronizacao.geral.enviado++;
                FotosCamerasTable.all({where: 'tabela="UsuariosTable"'}, function (retornoFotosCameras) {
                    if (retornoFotosCameras !== null) {
                        angular.forEach(retornoFotosCameras, function (value, key) {
                            console.log('UsuariosTable');
                            console.log(JSON.stringify(value));
                            UsuariosApiFactory.uploadImage($scope.user.id, value.imagem, function (ret) {
                                console.log(JSON.stringify(ret));
                                FotosCamerasTable.delete('id_referencia', $scope.user.id, function (retornoFotos) {
                                });
                            });
                        });
                    } else {
                        $scope._sincronizacao.geral.atualizado++;
                    }
                });
            });

            $scope._atualizar = function () {
                $timeout(function () {
                    $scope._hide();

                }, 5000);
            };

            $scope._atualizar();

            $scope._hide = function () {
                if ($scope.sincronizacao.ativacao_52.start === true && $scope.sincronizacao.checkin.start === true && $scope.sincronizacao.clientes.start === true && $scope.sincronizacao.produtos_clientes.start === true && $scope.sincronizacao.formularios_campos_valores.start === true && $scope._sincronizacao.geral.atualizado >= $scope._sincronizacao.geral.enviado) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 0);
                    NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.inicializacao);
                } else {
                    $scope._atualizar();
                }
            };


        });
