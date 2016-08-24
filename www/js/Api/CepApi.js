angular.module('starter')
        .factory('CepApiFactory', ['$http',
            function ($http) {

                var services = {};

                services.busca = function (cep, retorno) {
                    $http.get('http://cep.agenciavoxel.com.br/'+cep+'.json', {}).then(function (response) {
                        retorno(response);
                    }).catch(function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);
