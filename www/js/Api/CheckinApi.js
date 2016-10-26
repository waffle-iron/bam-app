angular.module('starter')
        .factory('CheckinApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        usuario_id: null,
                        cliente_id: null,
                        status: null,
                        data: null,
                        tipo: null,
                        latitude: null,
                        longitude: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('clientes-checkin/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    /*options = angular.merge({
                        id: null,
                        usuario_id: null,
                        cliente_id: null,
                        status: null,
                        data: null,
                        tipo: null,
                        latitude: null,
                        longitude: null,
                        modified: null,
                        created: null
                    }, options);*/
                    RequestModuloFactory.post('clientes-checkin/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
