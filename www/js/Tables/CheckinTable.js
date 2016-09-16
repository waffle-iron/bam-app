angular.module('starter')
        .factory('CheckinTable', ['TableModuloFactory', 'StorageModuloFactory',
            function (TableModuloFactory, StorageModuloFactory) {
                var services = {};
                services.drop = function (retorno) {
                    var sql = 'DROP TABLE checkin;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS checkin (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER(11), cliente_id INTEGER(11), status INTEGER(1), tipo VARCHAR(50), data VARCHAR(10), latitude VARCHAR(50), longitude VARCHAR(50), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };
                services.save = function (options, retorno) {
                    TableModuloFactory.get('checkin', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            id: null,
                            usuario_id: null,
                            cliente_id: null,
                            status: null,
                            tipo: null,
                            data: null,
                            latitude: null,
                            longitude: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('checkin', options, retorno, forceCreate);
                    });
                };

                services.save2 = function (options, retorno) {
                    services.first({where: 'usuario_id = "' + options.usuario_id + '" AND cliente_id = "' + options.cliente_id + '" AND tipo = "' + options.tipo + '"'}, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            id: null,
                            usuario_id: null,
                            cliente_id: null,
                            status: null,
                            tipo: null,
                            data: null,
                            latitude: null,
                            longitude: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('checkin', options, retorno, forceCreate);
                    });
                };
                services.all = function (options, retorno) {
                    TableModuloFactory.all('checkin', options, retorno);
                };
                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('checkin', options, retorno);
                };
                services.first = function (options, retorno) {
                    TableModuloFactory.first('checkin', options, retorno);
                };
                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('checkin', key, val, retorno);
                };
                services.delete = function (key, val, retorno) {
                    TableModuloFactory.delete('checkin', key, val, retorno);
                };
                services.update = function (options, id, retorno) {
                    TableModuloFactory.update('checkin', options, id, retorno);
                };
                services.insert = function (options, retorno) {
                    var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
                    options.usuario_id = user.id;
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            options.latitude = position.coords.latitude;
                            options.longitude = position.coords.longitude;
                            TableModuloFactory.insert('checkin', options, retorno);
                        }, function (r) {
                            TableModuloFactory.insert('checkin', options, retorno);
                        }, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
                    } else {
                        TableModuloFactory.insert('checkin', options, retorno);
                    }
                };
                return services;
            }
        ]);
