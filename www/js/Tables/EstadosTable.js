angular.module('starter')
        .factory('EstadosTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE estados;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS estados (id INTEGER PRIMARY KEY AUTOINCREMENT, estado VARCHAR(500), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('estados', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            estado: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('estados', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('estados', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('estados', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('estados', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('estados', key, val, retorno);
                };

                return services;
            }
        ]);