angular.module('starter')
        .factory('FormulariosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        nome: null,
                        status: null,
                        css: null,
                        js: null,
                        tipo: null,
                        sub_formulario_id: null,
                        argumento: null,
                        formularios_pergunta_id: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('formularios/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);