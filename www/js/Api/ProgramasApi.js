angular.module('starter')
        .factory('ProgramasApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        nome: null,
                        status: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('programas/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);