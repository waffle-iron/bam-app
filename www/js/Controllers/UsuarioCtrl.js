angular.module('starter')

        .controller('UsuarioCtrl', function ($scope, $stateParams, StorageModuloFactory, ExtraModuloFactory, LoadModuloFactory, $ionicActionSheet) {

            $scope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $scope.user.senha = "";

            // Triggered on a button click, or some other target
            $scope.userFoto = function () {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<b>Share</b> This'},
                        {text: 'Move'}
                    ],
                    destructiveText: 'Delete',
                    titleText: 'Modify your album',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        return true;
                    }
                });

            };
            
        });
