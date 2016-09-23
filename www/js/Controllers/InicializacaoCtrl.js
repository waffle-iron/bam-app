angular.module('starter')

        .controller('InicializacaoCtrl', function (ExtraModuloFactory, $timeout, moment, StorageModuloFactory, NavegacaoModuloFactory, $scope, LoadModuloFactory, ValidacaoModuloFactory,
                ClientesTable, CidadesTable, EstadosTable, ProgramasTable, ProdutosTable, ProdutosClientesTable,
                FormulariosCamposTable, FormulariosCamposValoresTable, FormulariosGruposCamposTable, FormulariosGruposTable, FormulariosTable,
                ClientesApiFactory, CidadesApiFactory, EstadosApiFactory, ProgramasApiFactory, ProdutosApiFactory, ProdutosClientesApiFactory, FormulariosApiFactory, FormulariosCamposValoresApiFactory) {

            /*if (ValidacaoModuloFactory.isNotNull(StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)) && moment(new Date()).format("YYYY-MM-DD") === StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)) {
             NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.home);
             } else {*/
            //LoadModuloFactory.show();

            var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            var convertData = function (data) {
                if (ValidacaoModuloFactory.isNotNull(data)) {
                    return moment(data).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            $scope._sincronizacao = {
                geral: {
                    baixado: 0,
                    atualizado: 0
                },
                requisicao: {
                    baixado: 0,
                    atualizado: 0
                }
            };

            $scope.sincronizacao = {
                clientes: {
                    nome: 'Clientes',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                cidades: {
                    nome: 'Cidades',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                estados: {
                    nome: 'Estados',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                programas: {
                    nome: 'Programas',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                produtos: {
                    nome: 'Produtos',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                produtos_clientes: {
                    nome: 'Produtos Clientes',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                formularios_campos: {
                    nome: 'Formularios Campos',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                formularios_grupos_campos: {
                    nome: 'Formularios Grupos Campos',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                formularios_grupos: {
                    nome: 'Formularios Grupos',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                },
                formularios: {
                    nome: 'Formularios',
                    baixado: 0,
                    atualizado: 0,
                    concluido: false
                }
            };


            var produtosClientes = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.produtos_clientes.baixado++;
                        $scope._sincronizacao.geral.baixado++;

                        var dados = {
                            cliente_id: v.cliente_id,
                            produto_id: v.produto_id,
                            status: 2,
                            modified: convertData(v.modified),
                            created: convertData(v.created),
                            valor: ExtraModuloFactory.moeda(v.valor)
                        };
                        ProdutosClientesTable.saveImportacao(dados, function (res) {
                            if (res !== null) {
                                $scope.sincronizacao.produtos_clientes.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                //$scope._hide();
                            }
                        });
                    });
                }
            };
            $scope._sincronizacao.requisicao.baixado++;
            ProdutosClientesTable.count(function (ret) {
                console.log(ret);
                if (ret > 0) {
                    ProdutosClientesApiFactory.index({'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial), usuario_id: user.id}, produtosClientes);
                } else {
                    ProdutosClientesApiFactory.index({usuario_id: user.id}, produtosClientes);
                }
            });


            var cidades = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.cidades.baixado++;
                        $scope._sincronizacao.geral.baixado++;

                        var dados = {
                            id: parseInt(v.id),
                            cidade: v.cidade,
                            estado_id: v.estado_id,
                            modified: convertData(v.modified),
                            created: convertData(v.created)
                        };
                        CidadesTable.replace(dados, function (res) {
                            if (res !== null) {
                                $scope.sincronizacao.cidades.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                //$scope._hide();
                            }
                        });
                    });
                }
            };
            $scope._sincronizacao.requisicao.baixado++;
            CidadesApiFactory.index({'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)}, cidades);

            var estados = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.estados.baixado++;
                        $scope._sincronizacao.geral.baixado++;
                        var dados = {
                            id: parseInt(v.id),
                            estado: v.estado,
                            modified: convertData(v.modified),
                            created: convertData(v.created)
                        };
                        EstadosTable.replace(dados, function (res) {
                            if (res !== null) {
                                $scope.sincronizacao.estados.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                //$scope._hide();
                            }
                        });
                    });
                }

            };
            $scope._sincronizacao.requisicao.baixado++;
            EstadosApiFactory.index({'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)}, estados);

            var programas = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.programas.baixado++;
                        $scope._sincronizacao.geral.baixado++;
                        var dados = {
                            id: parseInt(v.id),
                            nome: v.nome,
                            status: parseInt(v.status),
                            modified: convertData(v.modified),
                            created: convertData(v.created)
                        };
                        ProgramasTable.replace(dados, function (res) {
                            if (res !== null) {
                                $scope.sincronizacao.programas.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                //$scope._hide();
                            }
                        });
                    });
                }

            };
            $scope._sincronizacao.requisicao.baixado++;
            ProgramasApiFactory.index({'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)}, programas);

            var produtos = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.produtos.baixado++;
                        $scope._sincronizacao.geral.baixado++;
                        var dados = {
                            id: parseInt(v.id),
                            id_pai: parseInt(v.id_pai),
                            nome: v.nome,
                            status: parseInt(v.status),
                            modified: convertData(v.modified),
                            created: convertData(v.created)
                        };
                        ProdutosTable.replace(dados, function (res) {
                            if (res !== null) {
                                $scope.sincronizacao.produtos.atualizado++;
                                $scope._sincronizacao.geral.atualizado++;
                                //$scope._hide();
                            }
                        });
                    });
                }

            };
            $scope._sincronizacao.requisicao.baixado++;
            ProdutosApiFactory.index({limit: 1000, 'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)}, produtos);

            var rotas = function (retorno) {
                $scope._sincronizacao.requisicao.atualizado++;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.sincronizacao.clientes.baixado++;
                        $scope._sincronizacao.geral.baixado++;
                        if (v.cliente !== null) {
                            var dados = {
                                id: parseInt(v.cliente.id),
                                id_integracao: parseInt(v.cliente.id),
                                nome: v.cliente.nome,
                                foto: v.cliente.foto,
                                status: parseInt(v.cliente.status),
                                latitude: v.cliente.latitude,
                                longitude: v.cliente.longitude,
                                cep: v.cliente.cep,
                                endereco: v.cliente.endereco,
                                numero: v.cliente.numero,
                                complemento: v.cliente.complemento,
                                bairro: v.cliente.bairro,
                                codigo_concatenado: v.cliente.codigo_concatenado,
                                programa_id: parseInt(v.cliente.programa_id),
                                cidade_id: parseInt(v.cliente.cidade_id),
                                estado_id: parseInt(v.cliente.estado_id),
                                razao_social: v.cliente.razao_social,
                                modified: convertData(v.cliente.modified),
                                created: convertData(v.cliente.created),
                                url: v.cliente.url,
                                checkin: v.cliente.checkin
                            };
                            ClientesTable.replace(dados, function (res) {
                                if (res !== null) {
                                    $scope.sincronizacao.clientes.atualizado++;
                                    $scope._sincronizacao.geral.atualizado++;
                                }
                            });
                        }
                    });

                    var formularios = function (retorno) {
                        $scope._sincronizacao.requisicao.atualizado++;
                        if (ValidacaoModuloFactory.isOk(retorno.status)) {
                            angular.forEach(retorno.data.response.result, function (v, k) {
                                $scope.sincronizacao.formularios.baixado++;
                                $scope._sincronizacao.geral.baixado++;
                                var dados = {
                                    id: v.id,
                                    nome: v.nome,
                                    status: v.status,
                                    css: v.css,
                                    js: v.js,
                                    tipo: v.tipo,
                                    sub_formulario_id: v.sub_formulario_id,
                                    argumento: v.argumento,
                                    formularios_pergunta_id: v.formularios_pergunta_id,
                                    modified: convertData(v.modified),
                                    created: convertData(v.created)
                                };
                                FormulariosTable.replace(dados, function (res) {
                                    if (res !== null) {
                                        $scope.sincronizacao.formularios.atualizado++;
                                        $scope._sincronizacao.geral.atualizado++;
                                        angular.forEach(v.formularios_grupos, function (vGrupos, kGrupos) {
                                            $scope.sincronizacao.formularios_grupos.baixado++;
                                            $scope._sincronizacao.geral.baixado++;
                                            var dadosGrupos = {
                                                formulario_id: vGrupos.formulario_id,
                                                id: vGrupos.id,
                                                status: vGrupos.status,
                                                nome: vGrupos.nome,
                                                modified: convertData(vGrupos.modified),
                                                created: convertData(vGrupos.created)
                                            };
                                            FormulariosGruposTable.replace(dadosGrupos, function (resGrupos) {
                                                if (resGrupos !== null) {
                                                    $scope.sincronizacao.formularios_grupos.atualizado++;
                                                    $scope._sincronizacao.geral.atualizado++;
                                                    angular.forEach(vGrupos.formularios_grupos_campos, function (vGruposCampos, kGruposCampos) {
                                                        $scope.sincronizacao.formularios_grupos_campos.baixado++;
                                                        $scope._sincronizacao.geral.baixado++;
                                                        var dadosGruposCampos = {
                                                            formulario_id: vGruposCampos.formulario_id,
                                                            formularios_campo_id: vGruposCampos.formularios_campo_id,
                                                            formularios_grupo_id: vGruposCampos.formularios_grupo_id,
                                                            id: vGruposCampos.id,
                                                            ordem: vGruposCampos.ordem,
                                                            status: vGruposCampos.status,
                                                            modified: convertData(vGruposCampos.modified),
                                                            created: convertData(vGruposCampos.created)
                                                        };
                                                        FormulariosGruposCamposTable.replace(dadosGruposCampos, function (resGruposCampos) {
                                                            if (resGruposCampos !== null) {
                                                                $scope.sincronizacao.formularios_grupos_campos.atualizado++;
                                                                $scope._sincronizacao.geral.atualizado++;
                                                            }
                                                        });
                                                        if (vGruposCampos.formularios_campo !== null) {
                                                            var dadosCampos = {
                                                                atributos: vGruposCampos.formularios_campo.formularios_campos_id_ignore,
                                                                contem_imagem: vGruposCampos.formularios_campo.contem_imagem,
                                                                formulario_id: vGruposCampos.formularios_campo.formulario_id,
                                                                id: vGruposCampos.formularios_campo.id,
                                                                nome: vGruposCampos.formularios_campo.nome,
                                                                subtitulo: vGruposCampos.formularios_campo.subtitulo,
                                                                opcoes: vGruposCampos.formularios_campo.opcoes,
                                                                ordem: vGruposCampos.formularios_campo.ordem,
                                                                required: vGruposCampos.formularios_campo.required,
                                                                status: vGruposCampos.formularios_campo.status,
                                                                tipo: vGruposCampos.formularios_campo.tipo,
                                                                value: vGruposCampos.formularios_campo.value,
                                                                modified: convertData(vGruposCampos.formularios_campo.modified),
                                                                created: convertData(vGruposCampos.formularios_campo.created)
                                                            };

                                                            $scope.sincronizacao.formularios_campos.baixado++;
                                                            $scope._sincronizacao.geral.baixado++;
                                                            FormulariosCamposTable.replace(dadosCampos, function (resCampos) {
                                                                if (resCampos !== null) {
                                                                    $scope.sincronizacao.formularios_campos.atualizado++;
                                                                    $scope._sincronizacao.geral.atualizado++;
                                                                    //$scope._hide();
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }

                    };
                    $scope._sincronizacao.requisicao.baixado++;
                    FormulariosApiFactory.index({status: 1, 'data_hora_sincronizacao': StorageModuloFactory.local.get(StorageModuloFactory.enum.sincronizacaoInicial)}, formularios);

                }

            };
            $scope._sincronizacao.requisicao.baixado++;
            ClientesTable.query('DELETE FROM clientes', function (ret) {
                ClientesApiFactory.rotas({}, rotas);
            });


            $scope._atualizar = function () {
                $timeout(function () {
                    $scope._hide();

                }, 5000);
            };

            $scope._atualizar();

            $scope._hide = function () {
                if ($scope._sincronizacao.requisicao.atualizado === $scope._sincronizacao.requisicao.baixado && $scope._sincronizacao.geral.baixado === $scope._sincronizacao.geral.atualizado) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.sincronizacaoInicial, moment(new Date()).format("YYYY-MM-DD"));
                    ClientesTable.query('DELETE FROM produtos_clientes WHERE cliente_id not in(SELECT id_integracao FROM clientes)', function (ret) {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.home);
                    });

                } else {
                    $scope._atualizar();
                }
            };
            //}
        });
