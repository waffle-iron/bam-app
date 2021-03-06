angular.module('starter')

        .controller('OrientacaoCtrl', function (ExtraModuloFactory, $scope, $rootScope,
                StorageModuloFactory, LoadModuloFactory, ValidacaoModuloFactory, Config, BibliotecasApiFactory) {
            $scope.options = {
                sort: 'created',
                page: 1,
                tipo: 1,
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
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        $scope.bibliotecas.push(v);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    LoadModuloFactory.hide();
                } else if (ValidacaoModuloFactory.isNot(retorno.status)) {
                    $scope.proximo = true;
                    ExtraModuloFactory.error($scope, 'Nenhuma orientação localizada.');
                    LoadModuloFactory.hide();
                } else {
                    LoadModuloFactory.hide();
                    $scope.proximo = false;
                    ExtraModuloFactory.error($scope, 'Nenhuma orientação localizada.');
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao + ' | Status da transação: ' + retorno.status);
                }
            }

            $scope.color = function (key) {
                return ExtraModuloFactory.color(key);
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

        .controller('OrientacaoDetalhesCtrl', function ($scope, $stateParams, BibliotecasApiFactory, LoadModuloFactory) {

            $scope.dados = {};
            LoadModuloFactory.show();
            BibliotecasApiFactory.view($stateParams.id, function (result) {
                $scope.dados = result.data.response.result;
                LoadModuloFactory.hide();
            });

            $scope.myLink = function (dados) {
                if (!dados.url) {
                    return dados.link;
                } else {
                    return dados.url;
                }
            }
        });
