angular.module('starter')

        .controller('UsuarioCtrl', function (LoadModuloFactory, FileModuloFactory, FotosCamerasTable, NavegacaoModuloFactory, $scope, ValidacaoModuloFactory, StorageModuloFactory, $ionicActionSheet, CameraModuloFactory) {

            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $scope.user.senha = "";

            $scope.salvar = function (user) {
                if (!ValidacaoModuloFactory.isNotNull(user.nome)) {
                    ValidacaoModuloFactory.alert('Informe o seu nome');
                    return;
                }
                if (!ValidacaoModuloFactory.isNotNull(user.sobrenome)) {
                    ValidacaoModuloFactory.alert('Informe o seu sobrenome');
                    return;
                }
                if (!ValidacaoModuloFactory.isEmail(user.email)) {
                    ValidacaoModuloFactory.alert('Informe um endereço de e-mail valido');
                    return;
                }
                if (!ValidacaoModuloFactory.isNotNull(user.celular)) {
                    ValidacaoModuloFactory.alert('Informe o seu número de celular');
                    return;
                }
                if (!ValidacaoModuloFactory.isNotNull(user.login)) {
                    ValidacaoModuloFactory.alert('Informe o seu Login de usuário');
                    return;
                }
                StorageModuloFactory.local.setObject(StorageModuloFactory.enum.user, user);
                $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
                ValidacaoModuloFactory.alert('Dados de usuário alterados com sucesso.', 'Sucesso', function (r) {
                    NavegacaoModuloFactory.go(NavegacaoModuloFactory.enum.home);
                });
            }

            
            // Triggered on a button click, or some other target
            $scope.userFoto = function () {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="fa fa-camera"></i> Tirar nova foto'},
                        {text: '<i class="fa fa-photo"></i> Escolher na Galeria'}
                    ],
                    //destructiveText: 'Delete',
                    titleText: 'Modifique sua foto de perfil',
                    cancelText: 'Cancelar',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                CameraModuloFactory.capturarFoto(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'UsuariosTable',
                                            id_referencia: $scope.user.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    $scope.user.url = img;
                                                    LoadModuloFactory.hide();
                                                }
                                        );
                                    }
                                });
                                break;
                            case 1:
                                CameraModuloFactory.selecionarFoto(function (img) {
                                    if (img !== null) {
                                        LoadModuloFactory.show();
                                        FotosCamerasTable.save({
                                            tabela: 'UsuariosTable',
                                            id_referencia: $scope.user.id,
                                            sequencia: 0,
                                            imagem: img
                                        },
                                                function (retorno) {
                                                    $scope.user.url = img;
                                                    LoadModuloFactory.hide();
                                                }
                                        );
                                    }
                                });
                                break;
                        }
                        return true;
                    }
                });

            };

        });
