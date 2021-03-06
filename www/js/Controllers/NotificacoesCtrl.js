angular.module('starter')

        .controller('NotificacoesCtrl', function (moment, ExtraModuloFactory, $scope, $rootScope,
                StorageModuloFactory, LoadModuloFactory, ValidacaoModuloFactory, Config, NotificacoesApiFactory) {

            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            $scope.options = {
                sort: 'created',
                page: 1,
                limit: 10,
                direction: 'desc'
            };
            $scope.proximo = true;
            $scope.notificacoes = [];

            var conteudo = function (retorno) {
                console.log(retorno)
                $scope.proximo = true;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    $scope.proximo = retorno.data.response.paging.nextPage;
                    $scope.options.page = (retorno.data.response.paging.page + 1);
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        v.created = moment(v.created).format('DD/MM/YYYY HH:mm:ss');
                        $scope.notificacoes.push(v);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    LoadModuloFactory.hide();
                } else if (ValidacaoModuloFactory.isNot(retorno.status)) {
                    $scope.proximo = true;
                    ExtraModuloFactory.error($scope, 'Nenhuma notificações localizada.');
                    LoadModuloFactory.hide();
                } else {
                    LoadModuloFactory.hide();
                    $scope.proximo = false;
                    ExtraModuloFactory.error($scope, 'Nenhuma notificações localizada.');
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao + ' | Status da transação: ' + retorno.status);
                }

            }

            $scope.color = function (key) {
                return ExtraModuloFactory.color(key);
            };

            $scope.loadMore = function () {
                if ($scope.proximo) {
                    LoadModuloFactory.show();
                    NotificacoesApiFactory.lista($scope.options, conteudo);
                }
            };

            $scope.$on('$stateChangeComplete', function () {
                $scope.loadMore();
            });
        })

        .controller('NotificacoesDetalhesCtrl', function (moment, $scope, $stateParams, NotificacoesApiFactory, LoadModuloFactory) {

            $scope.dados = {};
            LoadModuloFactory.show();
            NotificacoesApiFactory.view($stateParams.id, function (result) {
                $scope.dados = result.data.response.result;
                $scope.dados.created = moment($scope.dados.created).format('DD/MM/YYYY HH:mm:ss');
                if ($scope.dados.data_inicio !== null) {
                    $scope.dados.data_inicio = moment($scope.dados.data_inicio).format('DD/MM/YYYY HH:mm:ss');
                }
                if ($scope.dados.data_fim !== null) {
                    $scope.dados.data_fim = moment($scope.dados.data_fim).format('DD/MM/YYYY HH:mm:ss');
                }
                LoadModuloFactory.hide();
            });
        });
