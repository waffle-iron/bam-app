angular.module('starter')
.factory('Ativacao52Table', ['TableModuloFactory',
function (TableModuloFactory) {
  var services = {};

  services.drop = function (retorno) {
    var sql = 'DROP TABLE ativacao_52;';
    TableModuloFactory.query(sql, function (e) {
      services.create(retorno);
    });
  };
  services.create = function (retorno) {
    var sql = 'CREATE TABLE IF NOT EXISTS ativacao_52 (id INTEGER PRIMARY KEY AUTOINCREMENT, evento VARCHAR(500), descricao TEXT, local VARCHAR(500), data DATE, cliente_id INTEGER(11), usuario_id INTEGER(11), modified DATETIME, created DATETIME);';
    TableModuloFactory.query(sql, function (e) {
      retorno(e);
    });
  };

  services.save = function (options, retorno) {
    TableModuloFactory.get('ativacao_52', 'id', options.id, function (res) {
      var forceCreate = true;
      options = angular.merge({
        evento: null,
        descricao: null,
        data: null,
        local: null,
        cliente_id: null,
        usuario_id: null,
        modified: null,
        created: null
      }, options);
      if (res !== null) {
        forceCreate = false;
        options.id = res.id;
      }
      TableModuloFactory.save('ativacao_52', options, retorno, forceCreate);
    });

  };

  services.all = function (options, retorno) {
    TableModuloFactory.all('ativacao_52', options, retorno);
  };

  services.replace = function (options, retorno) {
    TableModuloFactory.replace('ativacao_52', options, retorno);
  };

  services.first = function (options, retorno) {
    TableModuloFactory.first('ativacao_52', options, retorno);
  };

  services.get = function (key, val, retorno) {
    TableModuloFactory.get('ativacao_52', key, val, retorno);
  };

  services.delete = function (key, val, retorno) {
    TableModuloFactory.delete('ativacao_52', key, val, retorno);
  };

  services.insert = function (options, retorno) {
    TableModuloFactory.insert('ativacao_52', options, retorno);
  };

  services.update = function (options, id, retorno) {
    TableModuloFactory.update('ativacao_52', options, id, retorno);
  };
  services.query = function (sql, retorno) {
    TableModuloFactory.query(sql, retorno);
  };
  return services;
}
]);
