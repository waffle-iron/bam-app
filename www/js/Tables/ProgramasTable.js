angular.module('starter')
        .factory('ProgramasTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE programas;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS programas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(500), status INTEGER(1), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('programas', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            nome: null,
                            status: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('programas', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('programas', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('programas', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('programas', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('programas', key, val, retorno);
                };

                return services;
            }
        ]);