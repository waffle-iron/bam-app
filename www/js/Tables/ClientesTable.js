angular.module('starter')
        .factory('ClientesTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = {};

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE clientes;';
                    TableModuloFactory.query(sql, function (e) {
                        services.create(retorno);
                    });
                };
                services.create = function (retorno) {
                    var sql = 'CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, id_integracao INTEGER(11), nome VARCHAR(500), foto VARCHAR(500), status INTEGER(1), latitude VARCHAR(50), longitude VARCHAR(50), cep VARCHAR(10), endereco VARCHAR(500), numero VARCHAR(100), complemento VARCHAR(250), bairro VARCHAR(250), codigo_concatenado VARCHAR(100), programa_id INTEGER(11), cidade_id INTEGER(11), estado_id INTEGER(11), razao_social VARCHAR(500), modified DATETIME, created DATETIME, url VARCHAR(500), sincronizado INT(1) DEFAULT(0), checkin INT(1) DEFAULT(0));';
                    TableModuloFactory.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.save = function (options, retorno) {
                    TableModuloFactory.get('clientes', 'id_integracao', options.id_integracao, function (res) {
                        var forceCreate = true;
                        options = angular.merge({
                            id_integracao: null,
                            nome: null,
                            foto: null,
                            status: null,
                            latitude: null,
                            longitude: null,
                            cep: null,
                            endereco: null,
                            numero: null,
                            complemento: null,
                            bairro: null,
                            codigo_concatenado: null,
                            programa_id: null,
                            cidade_id: null,
                            estado_id: null,
                            razao_social: null,
                            modified: null,
                            created: null,
                            url: null,
                            sincronizado: 0,
                            checkin: 0
                        }, options);
                        if (res !== null) {
                            options.id = res.id;
                            forceCreate = false;
                        }
                        TableModuloFactory.save('clientes', options, retorno, forceCreate);
                    });

                };

                services.all = function (options, retorno) {
                    TableModuloFactory.all('clientes', options, retorno);
                };

                services.replace = function (options, retorno) {
                    TableModuloFactory.replace('clientes', options, retorno);
                };

                services.first = function (options, retorno) {
                    TableModuloFactory.first('clientes', options, retorno);
                };

                services.get = function (key, val, retorno) {
                    TableModuloFactory.get('clientes', key, val, retorno);
                };

                services.update = function (options, id, retorno) {
                    TableModuloFactory.update('clientes', options, id, retorno);
                };

                services.selectDistance = function (latitude, longitude, retorno) {
                    TableModuloFactory.query('SELECT nome, endereco, numero, foto, url, id, checkin, latitude, longitude, (6371 * acos(cos(deg2rad('  + latitude +  ')) * cos(deg2rad(latitude)) * cos(deg2rad('  + longitude +  ') - deg2rad(longitude)) + sin(deg2rad('  + latitude +  ')) * sin(deg2rad(latitude)))) as distance FROM clientes ORDER BY distance', retorno);
                };

                services.query = function (query, retorno, params) {
                    TableModuloFactory.query(query, retorno, params);
                };

                return services;
            }
        ]);
