angular.module('starter')
        .factory('OcorrenciasApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        cliente_id: '',
                        usuario_id: '',
                        descricao: '',
                        id_pai: '',
                        tabela: '',
                        tipo: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('ocorrencias/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        cliente_id: '',
                        usuario_id: '',
                        descricao: '',
                        id_pai: '',
                        tabela: '',
                        tipo: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('ocorrencias/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        cliente_id: '',
                        usuario_id: '',
                        descricao: '',
                        id_pai: '',
                        tabela: '',
                        tipo: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('ocorrencias/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);