angular.module('starter')

        .controller('CheckInCtrl', function (ExtraModuloFactory, $scope, $rootScope, ClientesTable, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory, ValidacaoModuloFactory) {
            LoadModuloFactory.show();
            $scope.clientes = [];
            ClientesTable.all({
                order: 'c.nome asc',
                alias: 'c',
                from: 'c.nome, c.endereco, c.numero, c.foto, c.url, c.id, c.checkin'
            }, function (ret) {
                console.log('ret');
                console.log(JSON.stringify(ret));
                if (ret === null) {
                    StorageModuloFactory.local.set(StorageModuloFactory.enum.sincronizacaoInicial, '');
                    ExtraModuloFactory.info($scope, 'Nenhum PDV localizado, por favor entre no menu lateral e selecione a opção baixar dados.');
                } else {
                    angular.forEach(ret, function (v, k) {
                        if (v.checkin > 2) {
                            v.checkin_total = 2;
                        } else if (v.checkin == 1) {
                            v.checkin_total = 1;
                        } else {
                            v.checkin_total = 0;
                        }
                        $scope.clientes.push(v);
                    });
                }
                LoadModuloFactory.hide();
            });
            $scope.color = function (key) {
                return ExtraModuloFactory.color(key);
            };
            $scope.isShow = function (value, param) {
                return (value == param ? 1 : 0);
            };
            $scope.img = function (dados) {
                return ExtraModuloFactory.img(dados);
            };
            $scope.selecionado = function (cliente) {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.ocorrencias);
            };
        });
