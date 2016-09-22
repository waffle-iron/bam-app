angular.module('starter')
        .factory('ProdutosClientesTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE produtos_clientes;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS produtos_clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_id INTEGER(11), produto_id INTEGER(11), valor VARCHAR(20), status INTEGER(1), modified DATETIME, created DATETIME);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('produtos_clientes', 'id', options.id, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            cliente_id: null,
                            produto_id: null,
                            valor: null,
                            status: null,
                            modified: null,
                            created: null
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('produtos_clientes', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('produtos_clientes', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('produtos_clientes', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('produtos_clientes', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('produtos_clientes', key, val, retorno);
                };

                services.insert = function (options, retorno) {
                    TableModuloFactory.insert('produtos_clientes', options, retorno);
                };

                services.update = function (options, id, retorno) {
                    TableModuloFactory.update('produtos_clientes', options, id, retorno);
                };

                services.saveImportacao = function (options) {
                    services.first({where: 'cliente_id = ' + options.cliente_id + ' AND produto_id = ' + options.produto_id}
                    , function (resp) {
                        if (resp === null) {
                            var save = angular.merge({}, options);
                            services.insert(save, function (a) {
                            });
                        } else {
                            var save = angular.merge({}, resp, options);
                            services.update(save, resp.id, function (a) {

                            });
                        }
                    });
                };

                return services;
            }
        ]);