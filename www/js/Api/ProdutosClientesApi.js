angular.module('starter')
        .factory('ProdutosClientesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        cliente_id: null,
                        usuario_id: null,
                        status: null,
                        valor: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('produtos-clientes/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    /*options = angular.merge({
                        cliente_id: null,
                        usuario_id: null,
                        produto_id: null,
                        status: null,
                        valor: null,
                        modified: null,
                        created: null
                    }, options);*/
                    RequestModuloFactory.post('produtos-clientes/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
