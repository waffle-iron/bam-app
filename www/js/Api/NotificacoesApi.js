angular.module('starter')
        .factory('NotificacoesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        notificacao_id: null,
                        usuario_id: null,
                        status: 1,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('notificacoes-usuarios/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.lista = function (options, retorno) {
                    options = angular.merge({
                        status: 1
                    }, options);
                    RequestModuloFactory.get('notificacoes-usuarios/lista.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.view = function (id, retorno) {
                    RequestModuloFactory.get('notificacoes-usuarios/view/' + id + '.json', {}, function (response) {
                        retorno(response);
                    });
                };

                services.home = function (retorno) {
                    RequestModuloFactory.get('notificacoes-usuarios/home.json', {}, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);
