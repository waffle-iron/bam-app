angular.module('starter')
        .factory('FormulariosCamposValoresApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.add = function (options, retorno) {
                    options = angular.merge({
                        formulario_id: '',
                        formularios_campo_id: '',
                        value: '',
                        cliente_id: '',
                        usuario_id: '',
                        status: '',
                        imagem: '',
                        modified: '',
                        created: ''
                    }, options);
                    RequestModuloFactory.post('formularios-campos-valores/add.json', options, function (response) {
                        retorno(response);
                    });
                };

                services.uploadImage = function (id, image, retorno) {
                    RequestModuloFactory.post('formularios-campos-valores/upload-image/' + id + '.json', {image: image}, function (response) {
                        retorno(response);
                    });
                };


                return services;
            }
        ]);