angular.module('starter')

        .controller('OcorrenciasCtrl', function ($ionicModal, moment, $stateParams, ClientesTable, ExtraModuloFactory,
                $scope, $rootScope, ClientesTable,
                StorageModuloFactory, OcorrenciasTable, LoadModuloFactory,
                ValidacaoModuloFactory, NavegacaoModuloFactory, OcorrenciasApiFactory) {
            $scope.cliente = {};
            $scope.ocorrenciasLocais = [];
            $scope.ocorrencias = [];

            var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);

            var listaOcorrenciasLocais = function () {
                $scope.ocorrenciasLocais = [];
                OcorrenciasTable.all({where: 'cliente_id = ' + $scope.cliente.id, order: 'created DESC'}, function (resutl) {
                    angular.forEach(resutl, function (v, k) {
                        v.created = moment(v.created).format('DD/MM/YYYY HH:mm:ss');
                        $scope.ocorrenciasLocais.push(v);
                    });
                });
            }

            $scope.options = {
                cliente_id: $stateParams.id,
                sort: 'created',
                page: 1,
                limit: 10,
                direction: 'desc'
            };

            $scope.proximo = true;

            ClientesTable.get('id', $stateParams.id, function (result) {
                result.url = ExtraModuloFactory.img(result);
                $scope.cliente = result;
                listaOcorrenciasLocais();
            });

            var conteudo = function (retorno) {
                $scope.proximo = true;
                if (ValidacaoModuloFactory.isOk(retorno.status)) {
                    $scope.proximo = retorno.data.response.paging.nextPage;
                    $scope.options.page = (retorno.data.response.paging.page + 1);
                    angular.forEach(retorno.data.response.result, function (v, k) {
                        v.created = moment(v.created).format('DD/MM/YYYY HH:mm:ss');
                        $scope.ocorrencias.push(v);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    LoadModuloFactory.hide();
                } else if (ValidacaoModuloFactory.isNot(retorno.status)) {
                    $scope.proximo = true;
                    ExtraModuloFactory.error($scope, 'Nenhuma ocorrências localizada.');
                    LoadModuloFactory.hide();
                } else {
                    LoadModuloFactory.hide();
                    $scope.proximo = false;
                    ExtraModuloFactory.error($scope, 'Nenhuma ocorrências localizada.');
                    ValidacaoModuloFactory.alert(Config.avisoSemConexao, 'Erro');
                }
            }

            $scope.color = function (key) {
                return ExtraModuloFactory.color(key);
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

            $scope.formulario = {ocorrencia: null};

            $ionicModal.fromTemplateUrl('modalAddOcorrencias.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openModal = function () {
                $scope.modal.show();
                document.getElementById("textarea_ocorrencia").style.height = (window.screen.height - 140) + "px";
            };

            $scope.closeModal = function (form) {
                $scope.modal.hide();
                if (ValidacaoModuloFactory.isNotNull(ValidacaoModuloFactory.trim(form.ocorrencia))) {
                    OcorrenciasTable.insert({
                        cliente_id: $scope.cliente.id,
                        usuario_id: user.id,
                        descricao: form.ocorrencia,
                        id_pai: 0,
                        tipo: null,
                        tabela: null,
                        id_referencia: null,
                        modified: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    }, function () {
                        $scope.formulario = {ocorrencia: null};
                        listaOcorrenciasLocais();
                    });
                } else {
                    $scope.formulario = {ocorrencia: null};
                    listaOcorrenciasLocais();
                }
            };
        });
