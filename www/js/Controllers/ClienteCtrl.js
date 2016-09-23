angular.module('starter')

        .controller('ClienteCtrl', function (ValidacaoModuloFactory, GoogleApiFactory, $stateParams, ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {
            LoadModuloFactory.show();

            $scope.tipo_formulario = null;

            var flash = StorageModuloFactory.getFlash();
            if (flash) {
                ValidacaoModuloFactory.alert(flash);
            }

            $scope.selecionado = function (cliente) {
                if (ValidacaoModuloFactory.isNotNull($scope.tipo_formulario)) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                    cliente.url = ExtraModuloFactory.img(cliente);
                    LoadModuloFactory.show();
                    StorageModuloFactory.local.delete(StorageModuloFactory.enum.pdvAtivo);
                    StorageModuloFactory.local.setObject(StorageModuloFactory.enum.pdvAtivo, cliente);

                    LoadModuloFactory.hide();
                    if ($scope.tipo_formulario === 1) {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.rotaBam);
                    } else if ($scope.tipo_formulario === 2) {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.programaMercado);
                    } else if ($scope.tipo_formulario === 3) {
                        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.ativacao52);
                    }

                } else {
                    ValidacaoModuloFactory.alert('Informe um tipo de Programa.');
                }
            };

            $scope.serverSideChange = function (val) {
                $scope.tipo_formulario = val;
            };

            $scope.cliente = {};
            $scope.show_mapa = 1;

            ClientesTable.first(
                    {
                        from: 'c.id, c.id_integracao, c.nome, c.foto, c.status, c.latitude, c.longitude, c.cep, c.endereco, c.numero, c.complemento, c.bairro, c.codigo_concatenado, c.programa_id, c.cidade_id, c.estado_id, c.razao_social, c.modified, c.created, c.url, c.sincronizado, c.checkin, cd.cidade, e.estado',
                        alias: 'c',
                        join: 'LEFT JOIN cidades as cd ON c.cidade_id = cd.id LEFT JOIN estados as e ON c.estado_id = e.id',
                        where: 'c.id =' + $stateParams.id
                    }, function (result) {
                $scope.cliente = result;
                $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                StorageModuloFactory.local.delete(StorageModuloFactory.enum.pdvAtivo);
                StorageModuloFactory.local.setObject(StorageModuloFactory.enum.pdvAtivo, result);
                LoadModuloFactory.hide();

                if (ValidacaoModuloFactory.isNotNull(result.latitude) && ValidacaoModuloFactory.isNotNull(result.longitude)) {
                    $scope.show_mapa = 1;
                    LoadModuloFactory.mapa(result, $scope);
                } else {
                    GoogleApiFactory.buscaEndereco(result, function (cliente) {
                        if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                            result.latitude = cliente.latitude;
                            result.longitude = cliente.longitude;
                            result.cep = cliente.cep;
                            ClientesTable.update({
                                latitude: result.latitude,
                                longitude: result.longitude,
                                cep: result.cep,
                                status: 2
                            }, result.id, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                                $scope.show_mapa = 1;
                                LoadModuloFactory.mapa(result, $scope);
                            });
                        } else {
                            $scope.show_mapa = 0;
                        }
                    });
                }


            });
        })


        .controller('ClienteEditCtrl', function (FileModuloFactory, $rootScope, GoogleApiFactory, StorageModuloFactory, CameraModuloFactory, FotosCamerasTable, CepApiFactory, ValidacaoModuloFactory, $scope, $stateParams, ClientesTable, ExtraModuloFactory, LoadModuloFactory, $ionicActionSheet, $timeout, $state) {
            $scope.cliente = {};
            var loadClientes = function () {
                ClientesTable.first(
                        {
                            from: 'c.*, cd.cidade, e.estado',
                            alias: 'c',
                            join: 'LEFT JOIN cidades as cd ON c.cidade_id = cd.id LEFT JOIN estados as e ON c.estado_id = e.id',
                            where: 'c.id =' + $stateParams.id
                        }, function (result) {
                    $scope.cliente = angular.merge($scope.cliente, result);
                    $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                    LoadModuloFactory.hide();
                });
            }
            loadClientes();

            $scope.buscaCep = function (cep) {
                if (ValidacaoModuloFactory.trim(cep) !== '') {
                    CepApiFactory.busca(cep, function (ret) {
                        if (ValidacaoModuloFactory.isNotNull(ret.data)) {
                            if (ret.data.retorno.status === 'OK') {
                                $scope.cliente.endereco = ret.data.retorno.Cep.logradouro;
                                $scope.cliente.bairro = ret.data.retorno.Cep.bairro;
                            }
                        }
                    });
                }
            }

            $scope.tirarFoto = function () {

                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="fa fa-camera"></i> Tirar nova foto'},
                        {text: '<i class="fa fa-photo"></i> Escolher na Galeria'}
                    ],
                    titleText: 'Modifique a foto do PDV',
                    cancelText: 'Cancelar',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                CameraModuloFactory.capturarFotoFile(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'ClientesTable',
                                            id_referencia: $scope.cliente.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    FileModuloFactory.asUrl(img, function (retImagem) {
                                                        $scope.cliente.url = retImagem;
                                                        $scope.cliente.foto = 'img';
                                                        LoadModuloFactory.hide();
                                                    });
                                                }
                                        );
                                    }
                                });
                                break;
                            case 1:
                                CameraModuloFactory.selecionarFotoFile(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'ClientesTable',
                                            id_referencia: $scope.cliente.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    FileModuloFactory.asUrl(img, function (retImagem) {
                                                        $scope.cliente.url = retImagem;
                                                        $scope.cliente.foto = 'img';
                                                        LoadModuloFactory.hide();
                                                    });
                                                }
                                        );
                                    }
                                });
                                break;
                        }
                        return true;
                    }
                });

            };

            $scope.salvar = function (cliente) {
                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                cliente.url = $scope.cliente.url;
                cliente.foto = $scope.cliente.foto;
                var c = cliente;

                console.log('Dados pra salvar o cliente.');
                console.log(JSON.stringify(cliente));

                c.latitude = null;
                c.longitude = null;
                c.status = 2;
                delete c.cidade;
                delete c.estado;
                //delete c.url;
                GoogleApiFactory.buscaEndereco(c, function (cliente) {
                    c.latitude = cliente.latitude;
                    c.longitude = cliente.longitude;
                    //c.cep = cliente.cep;
                    c.endereco = cliente.endereco;
                    c.status = 2;
                    ClientesTable.update(c, $scope.cliente.id, function (a) {
                        StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                        $rootScope.atualizarPDV();
                        loadClientes();
                        ValidacaoModuloFactory.alert('Dados do cliente alterados com sucesso.', 'Sucesso', function (r) {
                            $state.go('app.cliente', {id: $scope.cliente.id});
                        });
                    });
                });
            }


        });
