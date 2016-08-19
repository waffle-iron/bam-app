angular.module('starter')
.factory('BibliotecasApiFactory', ['RequestModuloFactory',
function (RequestModuloFactory) {

  var services = {};

  services.index = function (options, retorno) {
    options = angular.merge({
      id: '',
      nome: '',
      descricao: '',
      tipo: '',
      status: 1,
      modified: '',
      created: ''
    }, options);
    RequestModuloFactory.get('bibliotecas/index.json', options, function (response) {
      retorno(response);
    });
  };


  services.view = function (id, retorno) {
    RequestModuloFactory.get('bibliotecas/view/'+id+'.json', {}, function (response) {
      retorno(response);
    });
  };


  return services;
}
]);
