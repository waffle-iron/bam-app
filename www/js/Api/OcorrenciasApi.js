angular.module('starter')
        .factory('OcorrenciasApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        cliente_id: null,
                        usuario_id: null,
                        descricao: null,
                        id_pai: null,
                        tabela: null,
                        tipo: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('ocorrencias/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (options, retorno) {
                    /*options = angular.merge({
                        id: null,
                        cliente_id: null,
                        usuario_id: null,
                        descricao: null,
                        id_pai: null,
                        tabela: null,
                        tipo: null,
                        modified: null,
                        created: null
                    }, options);*/
                    RequestModuloFactory.post('ocorrencias/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    /*options = angular.merge({
                        id: null,
                        cliente_id: null,
                        usuario_id: null,
                        descricao: null,
                        id_pai: null,
                        tabela: null,
                        tipo: null,
                        modified: null,
                        created: null
                    }, options);*/
                    RequestModuloFactory.post('ocorrencias/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);