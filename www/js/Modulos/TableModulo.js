angular.module('starter')
        .factory('TableModuloFactory', ['Config', 'ValidacaoModuloFactory',
            function (Config, ValidacaoModuloFactory) {
                var db = null;
                db = openDatabase(Config.database + ".db", "1", "Test DB", 25 * 1024 * 1024);
                var services = {};


                services.getColumm = function (table, retorno) {

                    services.query("SELECT name, sql FROM sqlite_master WHERE name = '" + table + "' AND type = 'table'", function (results) {
                        var columnNames = [];
                        if (results !== null) {
                            var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');

                            for (i in columnParts) {
                                if (typeof columnParts[i] === 'string')
                                    columnParts[i] = ValidacaoModuloFactory.trim(columnParts[i]);
                                columnParts[i] = columnParts[i].split(" ");
                                var _type = columnParts[i][1].indexOf("(");
                                _type = columnParts[i][1].substr(0, _type);
                                if (_type === '') {
                                    _type = columnParts[i][1];
                                }
                                if (_type.indexOf(")") >= 0) {
                                    _type = _type.substr(0, _type.indexOf(")"));
                                }
                                var dados = {
                                    columm: columnParts[i][0],
                                    type: _type,
                                    primary: (columnParts[i][2] + '_' + columnParts[i][3] + '_' + columnParts[i][4] === 'PRIMARY KEY AUTOINCREMENT' ? true : false),
                                }
                                columnNames.push(dados);
                            }
                        }
                        retorno(columnNames);
                    });
                }

                services.save = function (table, options, retorno, forceCreate) {
                    if (forceCreate === true) {
                        services.insert(table, options, retorno);
                    } else {
                        if (options.id !== null) {
                            services.update(table, options, options.id, retorno);
                        } else {
                            if (options.id === undefined || options.id === 'undefined' || options.id === '' || options.id === null) {
                                delete options.id;
                            }
                            services.insert(table, options, retorno);
                        }
                    }
                };

                services.insert = function (table, options, retorno) {
                    var key = [];
                    var value = [];
                    var _value = [];
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k);
                            //value.push('"' + ValidacaoModuloFactory.trim(v) + '"');
                            value.push(ValidacaoModuloFactory.trim(v));
                            _value.push('?');
                        }
                    });
                    var query = "INSERT INTO " + table + " (" + key.join(', ') + ") VALUES (" + _value.join(', ') + ");";
                    services.query(query, function (res) {
                        if (res !== null) {
                            options.id = res.insertId;
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    }, value);

                };

                services.replace = function (table, options, retorno) {
                    var key = [];
                    var value = [];
                    var _value = [];
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k);
                            //value.push('"' + ValidacaoModuloFactory.trim(v) + '"');
                            value.push(ValidacaoModuloFactory.trim(v));
                            _value.push('?');
                        }
                    });
                    var query = "INSERT OR REPLACE INTO " + table + " (" + key.join(', ') + ") VALUES (" + _value.join(', ') + ");";
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    }, value);
                };

                services.update = function (table, options, id, retorno) {
                    var key = [];
                    var value = [];
                    console.log('------------');
                    console.log(JSON.stringify(options));
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k + '=?');
                            value.push(ValidacaoModuloFactory.trim(v));
                        } else {
                            key.push(k + '=?');
                            value.push(null);
                        }
                    });
                    console.log(JSON.stringify(value));
                    console.log('------------');
                    var query = "UPDATE " + table + " SET " + key.join(', ') + " WHERE id = '" + id + "'";
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    }, value);

                };

                services.get = function (table, key, val, retorno) {
                    var query = "SELECT * FROM " + table + " WHERE " + key + " = '" + val + "' LIMIT 1";
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = res.rows.item(0);
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });

                };

                services.first = function (table, options, retorno) {
                    var conditions = angular.merge({
                        from: '*',
                        alias: null,
                        where: null,
                        order: null,
                        group: null,
                        limit: null,
                        join: null
                    }, options);
                    conditions.limit = 1;
                    services.all(table, conditions, function (r) {
                        if (r === null) {
                            retorno(null);
                        } else {
                            retorno(r[0]);
                        }
                    });
                };

                services.all = function (table, options, retorno) {
                    var conditions = angular.merge({
                        from: '*',
                        alias: null,
                        where: null,
                        order: null,
                        group: null,
                        limit: null,
                        join: null
                    }, options);
                    var query = [];
                    query.push("SELECT");
                    query.push(conditions.from);
                    query.push('FROM');
                    query.push(table);
                    if (!ValidacaoModuloFactory.empty(conditions.alias)) {
                        query.push("AS " + conditions.alias);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.join)) {
                        query.push(conditions.join);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.where)) {
                        query.push('WHERE');
                        query.push(conditions.where);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.group)) {
                        query.push('GROUP BY');
                        query.push(conditions.group);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.order)) {
                        query.push('ORDER BY');
                        query.push(conditions.order);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.limit)) {
                        query.push('LIMIT');
                        query.push(conditions.limit);
                    }
                    query = query.join(' ');
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = [];
                                for (var i = 0; i < len; i++) {
                                    obj.push(res.rows.item(i));
                                }
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });
                };


                services.deleteAll = function (table, options, retorno) {
                    var conditions = angular.merge({
                        where: null,
                    }, options);
                    var query = [];
                    query.push("DELETE");
                    query.push('FROM');
                    query.push(table);
                    if (!ValidacaoModuloFactory.empty(conditions.where)) {
                        query.push('WHERE');
                        query.push(conditions.where);
                    }

                    query = query.join(' ');
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = [];
                                for (var i = 0; i < len; i++) {
                                    obj.push(res.rows.item(i));
                                }
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });
                };


                services.count = function (table, retorno) {
                    var query = "SELECT COALESCE(COUNT(*), 0) as total FROM " + table;
                    services.query(query, function (res) {
                        if (res !== null) {
                            var obj = res.rows.item(0);
                            retorno(obj.total);
                        } else {
                            retorno(null);
                        }
                    });
                };

                services.delete = function (table, chave, valor, retorno) {
                    var query = "DELETE FROM " + table + ' WHERE ' + chave + ' = ' + valor;
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(true);
                        } else {
                            retorno(false);
                        }
                    });
                };

                services.query = function (query, retorno, params) {
                    params = params || [];
                    db.transaction(function (transaction) {
                        transaction.executeSql(query, params,
                                function (tx, result) {
                                    services.debug('SUCESSO DO SQL');
                                    services.debug(query);
                                    services.debug(tx);
                                    services.debug(params);
                                    retorno(result);
                                    /*try {
                                     services.debug(result);
                                     retorno(result);
                                     } catch (error) {
                                     services.debug(error);
                                     retorno(null);
                                     }*/

                                },
                                function (error) {
                                    services.debug('ERRO DO SQL');
                                    services.debug(params);
                                    services.debug(query);
                                    services.debug(error);
                                    retorno(null);
                                });
                    });
                };

                services.debug = function (val) {
                    if (Config.debug === true) {
                        if (angular.isObject(val) !== null) {
                            console.log(JSON.stringify(val));
                        } else if (angular.isArray(val) !== null) {
                            console.log(JSON.stringify(val));
                        } else {
                            console.log(val);
                        }
                        //console.log(val);
                    }
                };

                services.addslashes = function (str) {
                    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
                };

                return services;
            }
        ]);
