angular.module('starter')
        .factory('CepApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.busca = function (cep, retorno) {
                    RequestModuloFactory.get('util/cep/' + cep + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
