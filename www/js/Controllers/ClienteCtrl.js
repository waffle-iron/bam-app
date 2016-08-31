angular.module('starter')

        .controller('ClienteCtrl', function (moment, CheckinTable, ValidacaoModuloFactory, GoogleApiFactory, $stateParams, ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {
            LoadModuloFactory.show();

            $scope.tipo_formulario = null;

            $scope.selecionado = function (cliente) {
                if (ValidacaoModuloFactory.isNotNull($scope.tipo_formulario)) {
                    cliente.url = ExtraModuloFactory.img(cliente);
                    LoadModuloFactory.show();
                    StorageModuloFactory.local.delete(StorageModuloFactory.enum.pdvAtivo);
                    StorageModuloFactory.local.setObject(StorageModuloFactory.enum.pdvAtivo, cliente);
                    var tipo = '';
                    if ($scope.tipo_formulario === 1) {
                        tipo = 'Rota BAM';
                    } else if ($scope.tipo_formulario === 2) {
                        tipo = 'Programa de Mercado - RAC';
                    } else if ($scope.tipo_formulario === 3) {
                        tipo = 'Ativação 52 Semanas';
                    }
                    CheckinTable.insert({
                        usuario_id: null,
                        cliente_id: cliente.id,
                        status: 1,
                        tipo: tipo,
                        data: moment(new Date).format('YYYY-MM-DD'),
                        latitude: null,
                        longitude: null,
                        modified: moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
                        created: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    }, function (a) {
                        LoadModuloFactory.hide();
                        if ($scope.tipo_formulario === 1) {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.rotaBam);
                        } else if ($scope.tipo_formulario === 2) {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.programaMercado);
                        } else if ($scope.tipo_formulario === 3) {
                            NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.ativacao52);
                        }
                    });
                } else {
                    ValidacaoModuloFactory.alert('Informe um tipo de Programa.');
                }
            };

            $scope.serverSideChange = function (val) {
                $scope.tipo_formulario = val;
            }

            $scope.cliente = {};
            $scope.show_mapa = 1;

            ClientesTable.first(
                    {
                        from: 'c.*, cd.cidade, e.estado',
                        alias: 'c',
                        join: 'INNER JOIN cidades as cd ON c.cidade_id = cd.id INNER JOIN estados as e ON c.estado_id = e.id',
                        where: 'c.id =' + $stateParams.id
                    }, function (result) {
                $scope.cliente = result;
                $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                StorageModuloFactory.local.delete(StorageModuloFactory.enum.pdvAtivo);
                StorageModuloFactory.local.setObject(StorageModuloFactory.enum.pdvAtivo, result);
                LoadModuloFactory.hide();

                if (!ValidacaoModuloFactory.isNotNull(result.latitude) || !ValidacaoModuloFactory.isNotNull(result.longitude)) {
                    GoogleApiFactory.buscaEndereco(result, function (cliente) {
                        console.log(JSON.stringify(cliente));
                        if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                            result.latitude = cliente.latitude;
                            result.longitude = cliente.longitude;
                            result.cep = cliente.cep;
                            //result.endereco = cliente.endereco;
                            //result.bairro = cliente.bairro;
                            ClientesTable.update({
                                latitude: result.latitude,
                                longitude: result.longitude,
                                cep: result.cep,
                                //endereco: result.endereco,
                                //bairro: result.bairro,
                                status: 2
                            }, result.id, function (a) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                                LoadModuloFactory.mapa(result, $scope);
                            });
                        } else {
                            $scope.show_mapa = 0;
                            ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                        }
                    });
                } else {
                    LoadModuloFactory.mapa(result, $scope);
                }
            });
        })


        .controller('ClienteEditCtrl', function (GoogleApiFactory, StorageModuloFactory, CameraModuloFactory, FotosCamerasTable, CepApiFactory, ValidacaoModuloFactory, $scope, $stateParams, ClientesTable, ExtraModuloFactory, LoadModuloFactory, $ionicActionSheet, $timeout, $state) {
            $scope.cliente = {};
            var loadClientes = function () {
                ClientesTable.first(
                        {
                            from: 'c.*, cd.cidade, e.estado',
                            alias: 'c',
                            join: 'INNER JOIN cidades as cd ON c.cidade_id = cd.id INNER JOIN estados as e ON c.estado_id = e.id',
                            where: 'c.id =' + $stateParams.id
                        }, function (result) {
                    $scope.cliente = result;
                    $scope.cliente.url = ExtraModuloFactory.img($scope.cliente);
                    LoadModuloFactory.hide();
                });
            }
            loadClientes();

            $scope.buscaCep = function (cep) {
                CepApiFactory.busca(cep, function (ret) {
                    console.log(JSON.stringify(ret));
                    if (ret.data.retorno.status === 'OK') {
                        $scope.cliente.endereco = ret.data.retorno.Cep.logradouro;
                        $scope.cliente.bairro = ret.data.retorno.Cep.bairro;
                    }
                });
            }

            // Triggered on a button click, or some other target
            $scope.tirarFoto = function () {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="fa fa-camera"></i> Tirar nova foto'},
                        {text: '<i class="fa fa-photo"></i> Escolher na Galeria'}
                    ],
                    //destructiveText: 'Delete',
                    titleText: 'Modifique sua foto de perfil',
                    cancelText: 'Cancelar',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                CameraModuloFactory.capturarFoto(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'ClientesTable',
                                            id_referencia: $scope.cliente.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    $scope.cliente.url = img;
                                                    $scope.cliente.foto = 'img';
                                                    LoadModuloFactory.hide();
                                                }
                                        );
                                    }
                                });
                                break;
                            case 1:
                                CameraModuloFactory.selecionarFoto(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'ClientesTable',
                                            id_referencia: $scope.cliente.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    $scope.cliente.url = img;
                                                    $scope.cliente.foto = 'img';
                                                    LoadModuloFactory.hide();
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
                if (!ValidacaoModuloFactory.isNotNull(cliente.cep)) {
                    ValidacaoModuloFactory.alert('Informe o seu CEP');
                    return;
                }
                cliente.url = $scope.cliente.url;
                cliente.foto = $scope.cliente.foto;
                var c = cliente;
                c.latitude = null;
                c.longitude = null;
                c.status = 2;
                var id = c.id;
                delete c.id;
                delete c.cidade;
                delete c.estado;
                //delete c.url;
                ClientesTable.update(c, id, function (a) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                    loadClientes();
                    GoogleApiFactory.buscaEndereco(c, function (cliente) {
                        c.latitude = cliente.latitude;
                        c.longitude = cliente.longitude;
                        c.cep = cliente.cep;
                        c.endereco = cliente.endereco;
                        //c.bairro = cliente.bairro;
                        ClientesTable.update({
                            latitude: c.latitude,
                            longitude: c.longitude,
                            cep: c.cep,
                            //endereco: c.endereco,
                            //bairro: c.bairro,
                            status: 2
                        }, c.id, function (a) {
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                            ValidacaoModuloFactory.alert('Dados do cliente alterados com sucesso.', 'Sucesso', function (r) {
                                $state.go('app.cliente', {id: $scope.cliente.id});
                            });
                        });
                    });
                });
            }

        });
