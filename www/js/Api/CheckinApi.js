angular.module('starter')
        .factory('CheckinApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        usuario_id: '',
                        cliente_id: '',
                        status: '',
                        data: '',
                        tipo: '',
                        latitude: '',
                        longitude: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('clientes-checkin/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        usuario_id: '',
                        cliente_id: '',
                        status: '',
                        data: '',
                        tipo: '',
                        latitude: '',
                        longitude: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('clientes-checkin/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
