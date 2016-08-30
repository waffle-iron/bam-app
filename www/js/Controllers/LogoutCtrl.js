angular.module('starter')

        .controller('LogoutCtrl', function ($scope, LoadModuloFactory, StorageModuloFactory, NavegacaoModuloFactory) {

            LoadModuloFactory.show();
            console.log(StorageModuloFactory.local.get(StorageModuloFactory.enum.hasSincronizacao));
            if (StorageModuloFactory.local.get(StorageModuloFactory.enum.hasSincronizacao) > 0) {
                LoadModuloFactory.hide();
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.upload);
            } else {
                StorageModuloFactory.local.destroy();
                LoadModuloFactory.hide();
                NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.login);
            }
        });
