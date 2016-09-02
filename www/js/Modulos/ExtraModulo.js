angular.module('starter')
        .factory('ExtraModuloFactory',
                function (ValidacaoModuloFactory, $ionicScrollDelegate) {

                    var services = {};

                    services.top = function () {
                        $ionicScrollDelegate.scrollTop();
                    };

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

                        if (hora >= 0 && hora < 6)
                            return 'Bom madrugada';
                        else if (hora >= 6 && hora < 12)
                            return 'Bom dia';
                        else if (hora >= 12 && hora < 18)
                            return 'Boa tarde';
                        else
                            return 'Boa noite';
                    };

                    services.conversaoDeHistoricos = function (str) {
                        switch (str) {
                            case 'Rota BAM':
                                return 1;
                                break;
                            case 'Programa de Mercado - RAC':
                                return 2;
                                break;
                            case 'Ativação 52 Semanas':
                                return 3;
                                break;
                            default:
                                return 0;
                                break;
                        }
                    };

                    services.desconversaoDeHistoricos = function (str) {
                        switch (parseInt(str)) {
                            case 1:
                                return 'Rota BAM';
                                break;
                            case 2:
                                return 'Programa de Mercado - RAC';
                                break;
                            case 3:
                                return 'Ativação 52 Semanas';
                                break;
                            default:
                                return 'Nome não localizado';
                                break;
                        }
                    };

                    return services;
                }
        );
