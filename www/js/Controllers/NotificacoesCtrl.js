angular.module('starter')

.controller('NotificacoesCtrl', function (moment, ExtraModuloFactory, $scope, $rootScope,
  StorageModuloFactory, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, NotificacoesApiFactory) {

    $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

    $scope.options = {
      sort: 'created',
      page: 1,
      usuario_id: $scope.user.id,
      limit: 10,
      direction: 'desc'
    };
    $scope.proximo = true;
    $scope.notificacoes = [];

    var conteudo = function (retorno) {
      $scope.proximo = true;
      if (ValidacaoModuloFactory.isOk(retorno.status)) {
        $scope.proximo = retorno.data.response.paging.nextPage;
        $scope.options.page = (retorno.data.response.paging.page + 1);
        angular.forEach(retorno.data.response.result, function(v, k){
          v.created = moment(v.created).format('DD/MM/YYYY HH:mm:ss');
          $scope.notificacoes.push(v);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        $scope.proximo = false;
        ExtraModuloFactory.console.error($scope, 'Nenhuma notificação localizada.');
      }
      LoadModuloFactory.hide();
    }

    $scope.color = function (key) {
      return ExtraModuloFactory.color(key);
    };

    $scope.loadMore = function () {
      if ($scope.proximo) {
        LoadModuloFactory.show();
        NotificacoesApiFactory.index($scope.options, conteudo);
      }
    };

    $scope.$on('$stateChangeComplete', function () {
      $scope.loadMore();
    });
  })

  .controller('NotificacoesDetalhesCtrl', function (moment, $scope, $stateParams, NotificacoesApiFactory, LoadModuloFactory) {

    $scope.dados = {};
    LoadModuloFactory.show();
    NotificacoesApiFactory.view($stateParams.id, function(result){
      $scope.dados = result.data.response.result;
      $scope.dados.created = moment($scope.dados.created).format('DD/MM/YYYY HH:mm:ss');
      if($scope.dados.notificaco.data_inicio !== null){
        $scope.dados.notificaco.data_inicio = moment($scope.dados.notificaco.data_inicio).format('DD/MM/YYYY HH:mm:ss');
      }
      if($scope.dados.notificaco.data_fim !== null){
        $scope.dados.notificaco.data_fim = moment($scope.dados.notificaco.data_fim).format('DD/MM/YYYY HH:mm:ss');
      }
      LoadModuloFactory.hide();
    });
  });
