angular.module('starter')
        .factory('ProdutosClientesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        cliente_id: '',
                        usuario_id: '',
                        status: '',
                        valor: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.get('produtos-clientes/index.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.add = function (options, retorno) {
                    options = angular.merge({
                        cliente_id: '',
                        usuario_id: '',
                        produto_id: '',
                        status: '',
                        valor: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('produtos-clientes/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
