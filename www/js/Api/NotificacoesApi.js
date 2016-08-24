angular.module('starter')
        .factory('NotificacoesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        notificacao_id: '',
                        usuario_id: '',
                        status: 1,
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('notificacoes-usuarios/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                services.view = function (id, retorno) {
                    RequestModuloFactory.get('notificacoes-usuarios/view/' + id + '.json', {}, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);
