angular.module('starter')
        .factory('ClientesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        id_integracao: null,
                        nome: null,
                        foto: null,
                        status: null,
                        latitude: null,
                        longitude: null,
                        cep: null,
                        endereco: null,
                        numero: null,
                        complemento: null,
                        bairro: null,
                        codigo_concatenado: null,
                        programa_id: null,
                        cidade_id: null,
                        estado_id: null,
                        razao_social: null,
                        modified: null,
                        created: null,
                        url: null
                    }, options);
                    RequestModuloFactory.get('clientes/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.rotas = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        id_integracao: null,
                        nome: null,
                        foto: null,
                        status: null,
                        latitude: null,
                        longitude: null,
                        cep: null,
                        endereco: null,
                        numero: null,
                        complemento: null,
                        bairro: null,
                        codigo_concatenado: null,
                        programa_id: null,
                        cidade_id: null,
                        estado_id: null,
                        razao_social: null,
                        modified: null,
                        created: null,
                        url: null
                    }, options);
                    RequestModuloFactory.get('clientes/rotas.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (id, options, retorno) {
                    /*options = angular.merge({
                        id: null,
                        id_integracao: null,
                        nome: null,
                        foto: null,
                        status: null,
                        latitude: null,
                        longitude: null,
                        cep: null,
                        endereco: null,
                        numero: null,
                        complemento: null,
                        bairro: null,
                        codigo_concatenado: null,
                        programa_id: null,
                        cidade_id: null,
                        estado_id: null,
                        razao_social: null,
                        modified: null,
                        created: null,
                        url: null
                    }, options);*/
                    RequestModuloFactory.post('clientes/edit/' + id + '.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.uploadImage = function (id, image, retorno) {
                    RequestModuloFactory.post('clientes/upload-image/' + id + '.json', {image: image}, function (response) {
                        retorno(response);
                    });
                };

                services.historico = function (id, options, retorno) {
                    options = angular.merge({}, options);
                    RequestModuloFactory.get('clientes/historico/' + id + '.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.detalhesHistorico = function (cliente_id, data, tipo, retorno) {
                    RequestModuloFactory.get('clientes/detalhes-historico/' + cliente_id + '/' + data + '/' + tipo + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                services.relatorios = function (id, retorno) {
                    RequestModuloFactory.get('clientes/relatorios/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);