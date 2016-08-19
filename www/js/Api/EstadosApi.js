angular.module('starter')
        .factory('EstadosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        estado: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('estados/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);