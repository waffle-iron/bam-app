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

                    services.calculaDistance = function (lat1, lon1, lat2, lon2) {
                        var R = 6371; // now in km (change for get miles)
                        var dLat = (lat2 - lat1) * Math.PI / 180;
                        var dLon = (lon2 - lon1) * Math.PI / 180;
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        var d = (R * c) || 0;
                        return d;
                    };

                    services.saudacao = function () {
                        var data = new Date();
                        var hora = data.getHours();

                        if (hora < 12)
                            return 'Bom dia';
                        else if (hora >= 12 && hora < 18)
                            return 'Bom tarde';
                        else if (hora >= 18 && hora < 24)
                            return 'Bom noite';
                    };

                    return services;
                }
        );
