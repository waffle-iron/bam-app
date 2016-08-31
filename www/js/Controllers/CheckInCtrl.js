angular.module('starter')

        .controller('CheckInCtrl', function (Config, ValidacaoModuloFactory, $filter, ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {
            LoadModuloFactory.show();
            var lat = 0;
            var lng = 0;

            $scope.clientes = [];
            var _clientes = [];

            if (!navigator) {
                ValidacaoModuloFactory.alert(Config.avisoGpsInattivo);
                listaClientes();

            } else {
                navigator.geolocation.getCurrentPosition(function (position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    listaClientes();
                }, function () {
                    ValidacaoModuloFactory.alert(Config.avisoGpsInattivo);
                    listaClientes();
                }, {
                    timeout: 10000,
                    enableHighAccuracy: false
                });
            }

            function listaClientes() {

                ClientesTable.all({
                    order: 'c.nome asc',
                    alias: 'c',
                    from: 'c.nome, c.endereco, c.numero, c.foto, c.url, c.id, c.checkin, c.latitude, c.longitude'
                }, function (ret) {

                    if (ret === null) {
                        StorageModuloFactory.local.set(StorageModuloFactory.enum.sincronizacaoInicial, '');
                        ExtraModuloFactory.info($scope, 'Nenhum PDV localizado, por favor entre no menu lateral e selecione a opção baixar dados.');
                    } else {
                        angular.forEach(ret, function (v, k) {
                            var d = ExtraModuloFactory.calculaDistance(lat, lng, v.latitude, v.longitude);
                            v = angular.merge({
                                isShow1: 0,
                                isShow2: 0,
                                distance: parseInt(d).toFixed(2)
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

                            _clientes.push(v);
                        });
                        /*if (lat !== 0) {
                         _clientes.sort(function (a, b) {
                         if (a.distance < b.distance)
                         return -1;
                         if (a.distance > b.distance)
                         return 1;
                         return 0;
                         });
                         }*/
                        $scope.clientes = $filter('orderBy')(_clientes, 'distance', false);
                    }
                    LoadModuloFactory.hide();
                });
            }

            $scope.selecionado = function (cliente) {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.ocorrencias);
            };

            $scope.setDistance = function (value) {
                if (value == '0.00') {
                    return 'Não calculada';
                } else if (value < 1) {
                    return value + ' m';
                } else {
                    //return parseFloat(value / 1000).toFixed(2) + ' km';
                    return value + ' km';
                }
            }
        });
