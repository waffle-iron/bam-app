angular.module('starter')
        .factory('FotosCamerasTable', ['TableModuloFactory', 'FileModuloFactory',
            function (TableModuloFactory, FileModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE fotos_cameras;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };

                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS fotos_cameras (id INTEGER PRIMARY KEY AUTOINCREMENT, tabela VARCHAR(500), id_referencia INTEGER(11), sequencia INTEGER(11), imagem TEXT);';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.first('fotos_cameras', {where: 'tabela="' + options.tabela + '" AND id_referencia="' + options.id_referencia + '" AND sequencia="' + options.sequencia + '"'}, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            tabela: null,
                            id_referencia: null,
                            sequencia: null,
                            imagem: null
                        }, options);
                        if (res !== null) {
                            forceCreate = false;
                            options.id = res.id;
                        }
                        TableModuloFactory.debug(options);
                        TableModuloFactory.save('fotos_cameras', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('fotos_cameras', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('fotos_cameras', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('fotos_cameras', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('fotos_cameras', key, val, retorno);
                };

                services.delete = function (key, val, retorno) {
                    TableModuloFactory.delete('fotos_cameras', key, val, retorno);
                };

                services.delete2 = function (key, val, retorno) {
                    TableModuloFactory.get('fotos_cameras', key, val, function (ret) {
                        if (ret !== null) {
                            TableModuloFactory.delete('fotos_cameras', key, val, retorno);
                            FileModuloFactory.remove(ret.imagem, function (ret) {});
                        }
                    });
                };

                services.insert = function (options, retorno) {
                    TableModuloFactory.insert('fotos_cameras', options, retorno);
                };

                services.update = function (options, id, retorno) {
                    TableModuloFactory.update('fotos_cameras', options, id, retorno);
                };

                services.query = function (sql, retorno) {
                    TableModuloFactory.query(sql, retorno);
                };

                return services;
            }
        ]);
