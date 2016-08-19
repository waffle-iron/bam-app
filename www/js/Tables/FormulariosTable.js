angular.module('starter')
        .factory('FormulariosTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE formularios;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS formularios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(45), status INTEGER(1), css TEXT, js TEXT, tipo INTEGER(2), created DATETIME, modified DATETIME, sub_formulario_id INTEGER(11), argumento VARCHAR(500), formularios_pergunta_id INTEGER(11));';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('formularios', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            nome: null,
                            status: null,
                            css: null,
                            js: null,
                            tipo: null,
                            created: null,
                            modified: null,
                            sub_formulario_id: null,
                            argumento: null,
                            formularios_pergunta_id: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('formularios', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('formularios', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('formularios', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('formularios', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('formularios', key, val, retorno);
                };

                return services;
            }
        ]);