angular.module('starter')
        .factory('FormulariosGruposTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE formularios_grupos;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS formularios_grupos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(255), status INTEGER(1), formulario_id INTEGER(11), created DATETIME, modified DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('formularios_grupos', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            nome: null,
                            status: null,
                            formulario_id: null,
                            created: null,
                            modified: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('formularios_grupos', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('formularios_grupos', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('formularios_grupos', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('formularios_grupos', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('formularios_grupos', key, val, retorno);
                };

                return services;
            }
        ]);