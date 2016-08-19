angular.module('starter')
        .factory('CidadesTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE cidades;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS cidades (id INTEGER PRIMARY KEY AUTOINCREMENT, cidade VARCHAR(500), estado_id INTEGER(11), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('cidades', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            cidade: null,
                            estado_id: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('cidades', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('cidades', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('cidades', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('cidades', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('cidades', key, val, retorno);
                };

                return services;
            }
        ]);