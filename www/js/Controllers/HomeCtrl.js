angular.module('starter')

        .controller('HomeCtrl', function (ExtraModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, $scope, $rootScope, StorageModuloFactory, NotificacoesApiFactory) {
            $scope.saudacao = ExtraModuloFactory.saudacao();
            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
            $scope.dados = {};
            NotificacoesApiFactory.home(function (retorno) {
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    $scope.dados = retorno.data.response.result;
                }
            });
        });
