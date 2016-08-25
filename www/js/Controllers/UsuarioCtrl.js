angular.module('starter')

        .controller('UsuarioCtrl', function ($scope, $stateParams, StorageModuloFactory, ExtraModuloFactory, LoadModuloFactory, $ionicActionSheet) {

            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $scope.user.senha = "";

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
                        return true;
                    }
                });

            };
            
        });
