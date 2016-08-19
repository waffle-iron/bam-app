angular.module('starter')
        .factory('LoadModuloFactory',
                function ($ionicLoading) {

                    var services = {};

                    services.show = function () {
                        $ionicLoading.show({
                            template: '<div><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><div class="padding-top">Aguarde ...</div></div>'
                        }).then(function () {
                            console.log("Iniciando o loading.");
                        });
                    };
                    services.hide = function () {
                        $ionicLoading.hide().then(function () {
                            console.log("Finalizando o loading.");
                        });
                    };

                    return services;
                }
        );