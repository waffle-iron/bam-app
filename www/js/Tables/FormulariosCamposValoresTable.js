angular.module('starter')
        .factory('FormulariosCamposValoresTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE formularios_campos_valores;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS formularios_campos_valores (id INTEGER PRIMARY KEY AUTOINCREMENT, formulario_id INTEGER(11), formularios_campo_id INTEGER(11), value TEXT, cliente_id INTEGER(11), usuario_id INTEGER(11), status INTEGER(1), imagem VARCHAR(500), created DATETIME, modified DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('formularios_campos_valores', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            formulario_id: null,
                            formularios_campo_id: null,
                            value: null,
                            cliente_id: null,
                            usuario_id: null,
                            status: null,
                            imagem: null,
                            created: null,
                            modified: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('formularios_campos_valores', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('formularios_campos_valores', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('formularios_campos_valores', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('formularios_campos_valores', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('formularios_campos_valores', key, val, retorno);
                };

                services.delete = function (key, val, retorno) {
                    TableModuloFactory.delete('formularios_campos_valores', key, val, retorno);
                };

                services.insert = function (options, retorno) {
                    TableModuloFactory.insert('formularios_campos_valores', options, retorno);
                };

                services.update = function (options, id, retorno) {
                    TableModuloFactory.update('formularios_campos_valores', options, id, retorno);
                };
                return services;
            }
        ]);