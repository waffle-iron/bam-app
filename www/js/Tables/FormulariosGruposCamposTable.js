angular.module('starter')
        .factory('FormulariosGruposCamposTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE formularios_grupos_campos;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS formularios_grupos_campos (id INTEGER PRIMARY KEY AUTOINCREMENT, formulario_id INTEGER(11), formularios_campo_id INTEGER(11), formularios_grupo_id INTEGER(11), status INTEGER(1), ordem INTEGER(11), created DATETIME, modified DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('formularios_grupos_campos', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            formulario_id: null,
                            formularios_campo_id: null,
                            formularios_grupo_id: null,
                            status: null,
                            ordem: null,
                            created: null,
                            modified: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('formularios_grupos_campos', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('formularios_grupos_campos', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('formularios_grupos_campos', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('formularios_grupos_campos', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('formularios_grupos_campos', key, val, retorno);
                };

                return services;
            }
        ]);
