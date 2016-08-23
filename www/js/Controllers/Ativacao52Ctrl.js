angular.module('starter')

.controller('Ativacao52Ctrl', function (CameraModuloFactory, ExtraModuloFactory, $scope, $rootScope, moment,
  StorageModuloFactory, LoadModuloFactory, ValidacaoModuloFactory, NavegacaoModuloFactory, Ativacao52Table, FotosCamerasTable) {

    $scope.cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
    $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
    if (ValidacaoModuloFactory.isNotNull($scope.cliente)) {

      $scope.ativacao = {
        id_resposta: 0,
        evento: null,
        descricao: null,
        data: new Date(),
        local: null
      }



      $scope.btn_imagem = 0;
      $scope.btn_ok = {
        ok_1: '',
        ok_2: '',
        ok_3: '',
      }

      $scope.salvar = function () {
        LoadModuloFactory.show();
        Ativacao52Table.first(
          {where: 'cliente_id = ' + $scope.cliente.id}
          , function (resp) {
            if (resp === null) {
              resp = {};
              resp.evento = $scope.ativacao.evento;
              resp.usuario_id = $scope.user.id;
              resp.cliente_id = $scope.cliente.id;
              resp.descricao = $scope.ativacao.descricao;
              resp.data = moment($scope.ativacao.data).format("YYYY-MM-DD");
              resp.local = $scope.ativacao.local;
              resp.created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              Ativacao52Table.insert(resp, function (a) {
                $scope.ativacao.id_resposta = a.id;
                $scope.btn_imagem = 1;
                LoadModuloFactory.hide();
                ExtraModuloFactory.console.success($scope, 'Todas as perguntas já foram respondidas.');
              });
            } else {
              resp.usuario_id = $scope.user.id;
              resp.cliente_id = $scope.cliente.id;
              resp.evento = $scope.ativacao.evento;
              resp.descricao = $scope.ativacao.descricao;
              resp.data = moment($scope.ativacao.data).format("YYYY-MM-DD");
              resp.local = $scope.ativacao.local;
              resp.modified = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              Ativacao52Table.update(resp, resp.id, function (a) {
                $scope.ativacao.id_resposta = a.id;
                $scope.btn_imagem = 1;
                LoadModuloFactory.hide();
                ExtraModuloFactory.console.success($scope, 'Todas as perguntas já foram respondidas.');

              });
            }

          });
        };

        $scope.tirarFoto = function (id) {
          CameraModuloFactory.capturarFotoFile(function (img) {
            if (img !== null) {
              FotosCamerasTable.save({tabela: 'Ativacao52Table',
              id_referencia: $scope.ativacao.id_resposta,
              sequencia: id,
              imagem: img},
              function (retorno) {});
              $scope.btn_ok['ok_' + id] = 'fa fa-check-square-o';
            }
          });
        }

      } else {
        NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.checkin);
      }
    });
