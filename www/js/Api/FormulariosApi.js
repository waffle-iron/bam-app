angular.module('starter')
        .factory('FormulariosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        nome: '',
                        status: '',
                        css: '',
                        js: '',
                        tipo: '',
                        sub_formulario_id: '',
                        argumento: '',
                        formularios_pergunta_id: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('formularios/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);