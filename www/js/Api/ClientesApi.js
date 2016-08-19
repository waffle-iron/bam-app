angular.module('starter')
        .factory('ClientesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        id_integracao: '',
                        nome: '',
                        foto: '',
                        status: '',
                        latitude: '',
                        longitude: '',
                        cep: '',
                        endereco: '',
                        numero: '',
                        complemento: '',
                        bairro: '',
                        codigo_concatenado: '',
                        programa_id: '',
                        cidade_id: '',
                        estado_id: '',
                        razao_social: '',
                        modified: '',
                        created: '',
                        url: ''
                    }, options);
                    RequestModuloFactory.get('clientes/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.rotas = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        id_integracao: '',
                        nome: '',
                        foto: '',
                        status: '',
                        latitude: '',
                        longitude: '',
                        cep: '',
                        endereco: '',
                        numero: '',
                        complemento: '',
                        bairro: '',
                        codigo_concatenado: '',
                        programa_id: '',
                        cidade_id: '',
                        estado_id: '',
                        razao_social: '',
                        modified: '',
                        created: '',
                        url: ''
                    }, options);
                    RequestModuloFactory.get('clientes/rotas.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (id, options, retorno) {
                    options = angular.merge({
                        id: '',
                        id_integracao: '',
                        nome: '',
                        foto: '',
                        status: '',
                        latitude: '',
                        longitude: '',
                        cep: '',
                        endereco: '',
                        numero: '',
                        complemento: '',
                        bairro: '',
                        codigo_concatenado: '',
                        programa_id: '',
                        cidade_id: '',
                        estado_id: '',
                        razao_social: '',
                        modified: '',
                        created: '',
                        url: ''
                    }, options);
                    RequestModuloFactory.put('clientes/edit/' + id + '.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.relatorios = function (id, retorno) {
                    RequestModuloFactory.put('clientes/relatorios/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);