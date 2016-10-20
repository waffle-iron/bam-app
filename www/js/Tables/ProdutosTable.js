angular.module('starter')
        .factory('ProdutosTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE produtos;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(500), status INTEGER(1), id_pai INTEGER(11), remove INTEGER(1), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('produtos', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            nome: null,
                            status: null,
                            id_pai: null,
                            remove: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('produtos', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('produtos', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('produtos', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('produtos', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('produtos', key, val, retorno);
                };
                
                services.delete = function (key, val, retorno) {
                    TableModuloFactory.delete('produtos', key, val, retorno);
                };

                return services;
            }
        ]);