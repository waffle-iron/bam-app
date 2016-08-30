angular.module('starter')

        .controller('LoginCtrl', function ($scope, UsuariosApiFactory, ValidacaoModuloFactory, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory,
                CheckinTable, ClientesTable, CidadesTable, EstadosTable, ProgramasTable, OcorrenciasTable, ProdutosTable, ProdutosClientesTable, Ativacao52Table,
                FormulariosCamposTable, FormulariosCamposValoresTable, FormulariosGruposCamposTable, FormulariosGruposTable, FormulariosTable, FotosCamerasTable) {

            $scope.redirecionar = function () {
                ClientesTable.create(function (e) {
                    CidadesTable.create(function (e) {
                        FormulariosCamposTable.create(function (e) {
                            FormulariosCamposValoresTable.create(function (e) {
                                FormulariosGruposCamposTable.create(function (e) {
                                    FormulariosGruposTable.create(function (e) {
                                        FormulariosTable.create(function (e) {
                                            EstadosTable.create(function (e) {
                                                ProgramasTable.create(function (e) {
                                                    OcorrenciasTable.create(function (e) {
                                                        ProdutosTable.create(function (e) {
                                                            ProdutosClientesTable.create(function (e) {
                                                                Ativacao52Table.create(function (e) {
                                                                    FotosCamerasTable.create(function (e) {
                                                                        CheckinTable.create(function (e) {
                                                                            LoadModuloFactory.hide();
                                                                            //NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.inicializacao);
                                                                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.home);
                                                                        });
                                                                    });

                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            };


            $scope.drop = function () {
                ClientesTable.drop(function (e) {
                    CidadesTable.drop(function (e) {
                        FormulariosCamposTable.drop(function (e) {
                            FormulariosCamposValoresTable.drop(function (e) {
                                FormulariosGruposCamposTable.drop(function (e) {
                                    FormulariosGruposTable.drop(function (e) {
                                        FormulariosTable.drop(function (e) {
                                            EstadosTable.drop(function (e) {
                                                ProgramasTable.drop(function (e) {
                                                    OcorrenciasTable.drop(function (e) {
                                                        ProdutosTable.drop(function (e) {
                                                            ProdutosClientesTable.drop(function (e) {
                                                                Ativacao52Table.drop(function (e) {
                                                                    FotosCamerasTable.drop(function (e) {
                                                                        CheckinTable.drop(function (e) {
                                                                            StorageModuloFactory.local.set(StorageModuloFactory.enum.sincronizacaoInicial, '');
                                                                            $scope.redirecionar();
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            };

            //$scope.drop();

            $scope.user = {
                login: null,
                senha: null
            };

            if (ValidacaoModuloFactory.isNotNull(StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user))) {
                LoadModuloFactory.show();
                $scope.redirecionar();
            }

            $scope.logar = function () {
                LoadModuloFactory.show();
                var erro = [];
                if (!ValidacaoModuloFactory.isNotNull($scope.user.login)) {
                    erro.push('Informe um usuário');
                }
                if (!ValidacaoModuloFactory.isNotNull($scope.user.senha)) {
                    erro.push('Informe uma senha');
                }
                if (erro.length < 1) {
                    var retornoLogin = function (retorno) {
                        LoadModuloFactory.hide();
                        if (ValidacaoModuloFactory.is('OK', retorno.status)) {
                            retorno.data.response.result.senha = $scope.user.senha;
                            StorageModuloFactory.local.setObject(StorageModuloFactory.enum.user, retorno.data.response.result);
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.Inicializacao, retorno.data.response.result);
                            LoadModuloFactory.show();
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, false);
                            $scope.drop();
                        } else {

                            ValidacaoModuloFactory.alert('Não foi possivel fazer o login tente novamente.');

                        }

                    };

                    UsuariosApiFactory.login($scope.user, retornoLogin);
                } else {
                    LoadModuloFactory.hide();
                    angular.forEach(erro, function (v, k) {
                        ValidacaoModuloFactory.alert(v);
                    });
                }
            };

        });
