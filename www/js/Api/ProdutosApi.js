angular.module('starter')
        .factory('ProdutosApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        nome: null,
                        id_pai: null,
                        status: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('produtos/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);