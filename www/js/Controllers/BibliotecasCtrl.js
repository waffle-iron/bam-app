angular.module('starter')

.controller('BibliotecasCtrl', function (moment, $stateParams, ExtraModuloFactory, $scope, $rootScope,
  StorageModuloFactory, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, BibliotecasApiFactory) {
  $scope.options = {
      sort: 'created',
      page: 1,
      tipo: 2,
      limit: 10,
      direction: 'desc'
    };
    $scope.proximo = true;
    $scope.bibliotecas = [];


    var conteudo = function (retorno) {
      $scope.proximo = true;
      if (ValidacaoModuloFactory.isOk(retorno.status)) {
        $scope.proximo = retorno.data.response.paging.nextPage;
        $scope.options.page = (retorno.data.response.paging.page + 1);
        angular.forEach(retorno.data.response.result, function(v, k){
          $scope.bibliotecas.push(v);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        $scope.proximo = false;
        ExtraModuloFactory.console.error($scope, 'Nenhuma biblioteca localizada.');
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
        BibliotecasApiFactory.index($scope.options, conteudo);
      }
    };

    $scope.$on('$stateChangeComplete', function () {
      $scope.loadMore();
    });
  })

  .controller('BibliotecasDetalhesCtrl', function ($scope, $stateParams, BibliotecasApiFactory, LoadModuloFactory) {

    $scope.dados = {};
    LoadModuloFactory.show();
    BibliotecasApiFactory.view($stateParams.id, function(result){
      $scope.dados = result.data.response.result;
      LoadModuloFactory.hide();
    });
    
    $scope.myLink=function(dados){
        if (!dados.url){
            return dados.link;
        }else{
            return dados.url;
        }
    }
  });
