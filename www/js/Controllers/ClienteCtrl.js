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
                console.log('Carregar Mapa');
                if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                    var div = document.getElementById("map_canvas");
                    var latLong = new google.maps.LatLng(cliente.latitude, cliente.longitude);
                    var mapOptions = {
                        center: latLong,
                        zoom: 18,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                                //streetViewControl: false,
                                //mapTypeControl: false
                    };

                    var map = new google.maps.Map(div, mapOptions);
                    var marker = new google.maps.Marker({
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        position: latLong,
                        map: map
                    });

                } else {
                    $scope.show_mapa = 0;
                    ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                }
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
        });
