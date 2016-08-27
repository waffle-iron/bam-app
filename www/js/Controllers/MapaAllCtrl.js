angular.module('starter')

        .controller('MapaAllCtrl', function (ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory) {
            LoadModuloFactory.show();
            $scope.clientes = [];
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

                        $scope.clientes.push(v);
                    });
                    LoadModuloFactory.mapaAll($scope.clientes, $scope);
                }
                LoadModuloFactory.hide();
            });

        });
