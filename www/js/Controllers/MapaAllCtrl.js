angular.module('starter')

        .controller('MapaAllCtrl', function (GoogleApiFactory, ValidacaoModuloFactory, ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory) {
            LoadModuloFactory.show();
            var listaClientes = [];
            var total = 0;
            var sequencia = 0;
            ClientesTable.all({
                order: 'c.nome asc',
                alias: 'c',
                from: 'c.*'
            }, function (ret) {
                if (ret === null) {
                    LoadModuloFactory.hide();
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.sincronizacaoInicial, '');
                    ExtraModuloFactory.info($scope, 'Nenhum PDV localizado, por favor entre no menu lateral e selecione a opção sincronizar dados.');
                } else {
                    total = (ret.length - 1);
                    angular.forEach(ret, function (v, k) {
                        v = angular.merge({
                            isShow1: 0,
                            isShow2: 0
                        }, v);
                        if (v.checkin >= 2) {
                            v.checkin_total = 2;
                            v.isShow2 = 1;
                        } else if (v.checkin == 1) {
                            v.checkin_total = 1;
                            v.isShow1 = 1;
                        } else {
                            v.checkin_total = 0;
                        }
                        v.url = ExtraModuloFactory.img(v);
                        if (!ValidacaoModuloFactory.isNotNull(v.latitude) || !ValidacaoModuloFactory.isNotNull(v.longitude)) {
                            GoogleApiFactory.buscaEndereco(v, function (cliente) {
                                if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                                    v.latitude = cliente.latitude;
                                    v.longitude = cliente.longitude;
                                    v.cep = cliente.cep;
                                    //v.endereco = cliente.endereco;
                                    //v.bairro = cliente.bairro;
                                    ClientesTable.update({
                                        latitude: v.latitude,
                                        longitude: v.longitude,
                                        cep: v.cep,
                                        //endereco: v.endereco,
                                        //bairro: v.bairro,
                                        status: 2
                                    }, v.id, function (a) {
                                        StorageModuloFactory.local.set(StorageModuloFactory.enum.hasSincronizacao, 1);
                                        listaClientes.push(v);
                                        sequencia++;
                                        execMapa();
                                    });
                                } else {
                                    listaClientes.push(v);
                                    sequencia++;
                                    execMapa();
                                }
                            });
                        } else {
                            listaClientes.push(v);
                            sequencia++;
                            execMapa();
                        }

                    });
                }

            });

            var execMapa = function () {
                if (sequencia >= total) {
                    LoadModuloFactory.hide();
                    LoadModuloFactory.mapaAll(listaClientes, $scope);
                }
            }

        });