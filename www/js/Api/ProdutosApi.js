angular.module('starter')
        .factory('ProdutosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        nome: '',
                        id_pai: '',
                        status: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('produtos/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);