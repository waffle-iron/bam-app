angular.module('starter')
        .factory('OcorrenciasTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE ocorrencias;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS ocorrencias (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_id INTEGER(11), usuario_id INTEGER(11), id_pai INTEGER(11), id_referencia INTEGER(11), descricao TEXT, tipo INTEGER(11), tabela VARCHAR(500), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('ocorrencias', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            cliente_id: null,
                            usuario_id: null,
                            descricao: null,
                            id_pai: null,
                            tipo: null,
                            tabela: null,
                            id_referencia: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('ocorrencias', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('ocorrencias', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('ocorrencias', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('ocorrencias', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('ocorrencias', key, val, retorno);
                };

                return services;
            }
        ]);