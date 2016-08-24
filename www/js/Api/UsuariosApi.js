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

                services.relatorios = function (id, retorno) {
                    RequestModuloFactory.put('usuarios/relatorios/' + id + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
