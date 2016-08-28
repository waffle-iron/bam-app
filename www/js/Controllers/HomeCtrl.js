angular.module('starter')

        .controller('HomeCtrl', function (ExtraModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory) {
            $scope.saudacao = ExtraModuloFactory.saudacao();
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
            }
        });
