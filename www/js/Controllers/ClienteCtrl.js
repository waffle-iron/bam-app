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

            $scope.loadMapa = function (cliente) {
                LoadModuloFactory.mapa(cliente);
            }

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
                        console.log('Buscando endereço.');
                        if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                            result.latitude = cliente.latitude;
                            result.longitude = cliente.longitude;
                            result.cep = cliente.cep;
                            result.endereco = cliente.endereco;
                            result.bairro = cliente.bairro;
                            ClientesTable.update({
                                latitude: result.latitude,
                                longitude: result.longitude,
                                cep: result.cep,
                                endereco: result.endereco,
                                bairro: result.bairro,
                                status: 2
                            }, result.id, function (a) {
                                $scope.loadMapa(result);
                            });
                        } else {
                            $scope.show_mapa = 0;
                            ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                        }
                    });
                } else {
                    $scope.loadMapa(result);
                }
            });
        })


        .controller('ClienteEditCtrl', function (CepApiFactory, $scope, $stateParams, ClientesTable, ExtraModuloFactory, LoadModuloFactory) {
            $scope.cliente = {};
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
                $scope.loadMapa(result);
            });

            $scope.loadMapa = function (cliente) {
                LoadModuloFactory.mapa(cliente);
            }
            $scope.buscaCep = function (cep) {
                CepApiFactory.busca(cep, function (ret) {
                    if (ret.data.result.status === 'OK') {
                        $scope.cliente.endereco = ret.data.result.Cep.logradouro;
                        $scope.cliente.bairro = ret.data.result.Cep.bairro;
                    }
                });
            }
            
            $scope.tirarFoto = function () {
                CameraModuloFactory.capturarFotoFile(function (img) {
                    if (img !== null) {
                        FotosCamerasTable.save({tabela: 'Clientes',
                            id_referencia: $scope.cliente.id,
                            sequencia: 0,
                            imagem: img}, function (retorno) {
                        });
                    }
                });
            }
            
            $scope.salvar = function (cliente){
                var c = cliente;
                c.latitude = null;
                c.longitude = null;
                c.status = 2;
                var id = c.id;
                delete c.id;
                delete c.cidade;
                delete c.estado;
                delete c.url;
                ClientesTable.update(c, id, function (a) {
                    
                });
            }

        });
