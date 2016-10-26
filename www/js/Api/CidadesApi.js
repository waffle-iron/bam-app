angular.module('starter')
        .factory('CidadesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        cidade: null,
                        estado_id: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('cidades/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);