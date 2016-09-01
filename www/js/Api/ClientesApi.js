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

                services.detalhesHistorico = function (usuario_id, data, tipo, retorno) {
                    RequestModuloFactory.get('clientes/detalhes-historico/' + usuario_id + '/' + data + '/' + tipo + '.json', null, function (response) {
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