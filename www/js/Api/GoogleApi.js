angular.module('starter')
        .factory('GoogleApiFactory', function ($http, RequestModuloFactory) {
            var service = {};
            service.getLocalizacao = function (latitude, longitude, listener) {
                var latlng = latitude + "," + longitude;
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&language=br';

                var cidade = null;
                var estado = null;
                var sigla = null;
                var continua = true;

                $http.get(url, null).then(function (response) {
                    angular.forEach(response.data.results[0].address_components, function (valueResponse, keyResponse) {
                        if (continua) {
                            angular.forEach(valueResponse.types, function (valueType, keyType) {
                                if (valueType === 'administrative_area_level_1') {
                                    estado = valueResponse.long_name;
                                    sigla = valueResponse.short_name;
                                }
                                if (valueType === 'locality') {
                                    cidade = valueResponse.long_name;
                                }
                            });
                        }
                    }, null);
                    listener(cidade, estado, sigla);
                }).catch(function (response) {
                    listener(cidade, estado, sigla);
                });
            };

            service.buscaEndereco = function (cliente, listener) {
                var ret = {
                    latitude: cliente.latitude,
                    longitude: cliente.longitude,
                    //cep: cliente.cep,
                    endereco: cliente.endereco,
                    bairro: cliente.bairro
                };
                RequestModuloFactory.post('util/endereco.json', cliente, function (response) {
                    var r = response.data.response.result;
                    if (r.status === 'OK') {
                        ret.latitude = (r.results[0].geometry.location.lat || ret.latitude);
                        ret.longitude = (r.results[0].geometry.location.lng || ret.longitude);

                        angular.forEach(r.results[0].address_components, function (v, k) {
                            angular.forEach(v.types, function (v1, k1) {
                                /*if (v1 === 'postal_code') {
                                    ret.cep = (v.long_name.replace('-', null).toString() || ret.cep).toString();
                                    if (ret.cep.length > 0 && ret.cep.length < 8) {
                                        ret.cep = ret.cep + '000';
                                    } else if (ret.cep.length > 7) {
                                        ret.cep = ret.cep;
                                    } else {
                                        ret.cep = null;
                                    }
                                }*/

                                if (v1 === 'route') {
                                    ret.endereco = (v.long_name.toString() || ret.endereco);
                                }

                                if (v1 === 'sublocality_level_1') {
                                    ret.bairro = (v.long_name.toString() || ret.bairro);
                                }
                            });
                        });

                        listener(ret);
                    } else {
                        listener(ret);
                    }
                });
            };
            return service;
        });
