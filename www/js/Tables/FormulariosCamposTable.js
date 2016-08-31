angular.module('starter')
        .factory('FormulariosCamposTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE formularios_campos;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS formularios_campos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(1000), subtitulo VARCHAR(1000), tipo VARCHAR(50), value TEXT, opcoes TEXT, required INTEGER(1), contem_imagem INTEGER(1), atributos TEXT, status INTEGER(1), ordem INTEGER(11), formulario_id INTEGER(11), created DATETIME, modified DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('formularios_campos', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            nome: null,
                            subtitulo: null,
                            tipo: null,
                            value: null,
                            opcoes: null,
                            required: null,
                            contem_imagem: null,
                            atributos: null,
                            status: null,
                            ordem: null,
                            formulario_id: null,
                            created: null,
                            modified: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.save('formularios_campos', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('formularios_campos', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('formularios_campos', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('formularios_campos', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('formularios_campos', key, val, retorno);
                };

                return services;
            }
        ]);
