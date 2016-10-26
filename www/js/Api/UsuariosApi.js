angular.module('starter')
        .factory('UsuariosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.login = function (options, retorno) {
                    /*options = angular.merge({
                     login: null,
                     senha: null
                     }, options);*/
                    RequestModuloFactory.post('usuarios/login.json', options, function (response) {
                        retorno(response);
                    });
                };
                services.validaLogin = function (options, retorno) {
                    /*options = angular.merge({
                     login: null,
                     id: null
                     }, options);*/
                    RequestModuloFactory.post('usuarios/valida-login.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.edit = function (id, options, retorno) {
                    /*options = angular.merge({
                     id: null,
                     nome: null,
                     sobrenome: null,
                     email: null,
                     celular: null,
                     login: null,
                     senha: null,
                     status: null,
                     token: null,
                     documento: null,
                     created: null,
                     modified: null,
                     tipo: null,
                     foto: null,
                     url: null
                     }, options);*/
                    options = angular.merge({
                        foto: null,
                        url: null
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
