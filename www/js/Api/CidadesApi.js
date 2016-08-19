angular.module('starter')
        .factory('CidadesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        cidade: '',
                        estado_id: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('cidades/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);