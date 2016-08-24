angular.module('starter')
        .factory('ExtraModuloFactory',
                function (ValidacaoModuloFactory) {

                    var services = {};

                    services.color = function (key) {
                        if (key % 2 === 0) {
                            return 'item-mydark';
                        } else {
                            return 'item-stable';
                        }
                    };

                    services.img = function (dados) {
                        if (ValidacaoModuloFactory.isNotNull(dados.foto)) {
                            return dados.url;
                        } else {
                            return 'img/ionic.jpg';
                        }
                    };

                    services.info = function (scope, msg) {
                        return services.flashMensage(scope, msg, 'calm');
                    };

                    services.success = function (scope, msg) {
                        return services.flashMensage(scope, msg, 'balanced');
                    };

                    services.error = function (scope, msg) {
                        return services.flashMensage(scope, msg, 'assertive');
                    };

                    services.clear = function (scope) {
                        return services.flashMensage(scope, '', '');
                    };

                    services.flashMensage = function (scope, msg, color) {
                        scope = angular.merge(
                                scope, {
                                    msg: msg,
                                    msg_color: color
                                }
                        );
                        return scope;
                    };

                    return services;
                }
        );
