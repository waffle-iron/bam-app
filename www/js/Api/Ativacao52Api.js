angular.module('starter')
        .factory('Ativacao52ApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        evento: '',
                        descricao: '',
                        data: '',
                        local: '',
                        cliente_id: '',
                        usuario_id: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('ativacao52/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                services.add = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        evento: '',
                        descricao: '',
                        data: '',
                        local: '',
                        cliente_id: '',
                        usuario_id: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('ativacao52/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
