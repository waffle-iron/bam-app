angular.module('starter')

        .controller('LogoutCtrl', function ($scope, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {

            LoadModuloFactory.show();
            if (StorageModuloFactory.local.get(StorageModuloFactory.enum.hasSincronizacao) !== true) {
                StorageModuloFactory.local.destroy();
                LoadModuloFactory.hide();
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.login);
            } else {
                LoadModuloFactory.hide();
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.upload);
            }
        });
