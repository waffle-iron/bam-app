angular.module('starter')
        .factory('UsuariosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.login = function (options, retorno) {
                    options = angular.merge({
                        login: '',
                        senha: ''
                    }, options);
                    RequestModuloFactory.post('usuarios/login.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (id, options, retorno) {
                    options = angular.merge({
                        id: '',
                        nome: '',
                        sobrenome: '',
                        email: '',
                        celular: '',
                        login: '',
                        senha: '',
                        status: '',
                        token: '',
                        documento: '',
                        created: '',
                        modified: '',
                        tipo: '',
                        foto: '',
                        url: ''
                    }, options);
                    delete options.foto;
                    delete options.url;
                    RequestModuloFactory.post('usuarios/edit/' + id + '.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.uploadImage = function (id, image, retorno) {
                    RequestModuloFactory.post('usuarios/upload-image/' + id + '.json', {image: image}, function (response) {
                        retorno(response);
                    });
                };

                services.historico = function (id, options, retorno) {
                    options = angular.merge({}, options);
                    RequestModuloFactory.get('usuarios/historico/' + id + '.json', options, function (response) {
                        retorno(response);
                    });
                };
                
                services.historicoRac = function (id, retorno) {
                    RequestModuloFactory.get('usuarios/range-all/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                services.relatorios = function (id, retorno) {
                    RequestModuloFactory.post('usuarios/relatorios/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                services.respostaSelecionada = function (id, retorno) {
                    RequestModuloFactory.post('usuarios/resposta-selecionada/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
