angular.module('starter')

.controller('OcorrenciasCtrl', function (moment, $stateParams, ClientesTable, ExtraModuloFactory, $scope, $rootScope, ClientesTable,
  StorageModuloFactory, OcorrenciasTable, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, OcorrenciasApiFactory) {
    $scope.cliente = {};
    $scope.options = {
      cliente_id:$stateParams.id,
      sort: 'created',
      page: 1,
      limit: 10,
      direction: 'desc'
    };
    $scope.proximo = true;
    ClientesTable.get('id',$stateParams.id, function(result){
      $scope.cliente = result;
    });

    $scope.ocorrencias = [];

    var conteudo = function (retorno) {
      $scope.proximo = true;
      if (ValidacaoModuloFactory.isOk(retorno.status)) {
        $scope.proximo = retorno.data.response.paging.nextPage;
        $scope.options.page = (retorno.data.response.paging.page + 1);
        angular.forEach(retorno.data.response.result, function(v, k){
          v.created = moment(v.created).format('DD/MM/YYYY HH:mm:ss');
          $scope.ocorrencias.push(v);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        $scope.proximo = false;
        ExtraModuloFactory.console.error($scope, 'Nenhuma ocorrência localizada.');
      }
      LoadModuloFactory.hide();
    }

    $scope.color = function (key) {
      return ExtraModuloFactory.color(key);
    };

    $scope.img = function (dados) {
      return ExtraModuloFactory.img(dados);
    };

    $scope.loadMore = function () {
      if ($scope.proximo) {
        LoadModuloFactory.show();
        OcorrenciasApiFactory.index($scope.options, conteudo);
      }
    };

    $scope.$on('$stateChangeComplete', function () {
      $scope.loadMore();
    });
  });
