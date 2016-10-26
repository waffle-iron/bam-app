angular.module('starter')
        .factory('Ativacao52ApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.index = function (options, retorno) {
                    options = angular.merge({
                        id: null,
                        evento: null,
                        descricao: null,
                        data: null,
                        local: null,
                        cliente_id: null,
                        usuario_id: null,
                        modified: null,
                        created: null
                    }, options);
                    RequestModuloFactory.get('ativacao52/index.json', options, function (response) {
                        retorno(response);
                    });
                };


                services.add = function (options, retorno) {
                    /*options = angular.merge({
                        id: null,
                        evento: null,
                        descricao: null,
                        data: null,
                        local: null,
                        cliente_id: null,
                        usuario_id: null,
                        modified: null,
                        created: null
                    }, options);*/
                    RequestModuloFactory.post('ativacao52/add.json', options, function (response) {
                        retorno(response);
                    });
                };
                
                services.uploadImage = function (id, image, retorno) {
                    RequestModuloFactory.post('ativacao52/upload-image/' + id + '.json', {image: image}, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);
