angular.module('starter')
        .factory('CameraModuloFactory', function ($cordovaCamera) {
            var service = {};

            service.loadCamera = function () {
                try {
                    if (Camera) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (err) {
                    return false;
                }
            }

            service.exec = function (options, listener) {
                if (service.loadCamera()) {
                    options = angular.merge({
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 800,
                        targetHeight: 600,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false,
                        correctOrientation: false
                    }, options);
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        if (options.destinationType === Camera.DestinationType.DATA_URL) {
                            listener("data:image/jpeg;base64," + imageData);
                        } else {
                            listener(imageData);
                        }
                    }, function (err) {
                        listener(null);
                    });
                } else {
                    listener(null);
                }
            };

            service.selecionarFoto = function (listener) {
                if (service.loadCamera()) {
                    var options = {
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: Camera.DestinationType.DATA_URL
                    };
                    service.exec(options, listener);
                } else {
                    listener(null);
                }
            };

            service.capturarFoto = function (listener) {
                if (service.loadCamera()) {

                    var options = {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.DATA_URL
                    };
                    service.exec(options, listener);
                } else {
                    listener(null);
                }
            };

            service.selecionarFotoFile = function (listener) {
                if (service.loadCamera()) {

                    var options = {
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: Camera.DestinationType.FILE_URL
                    };
                    service.exec(options, listener);
                } else {
                    listener(null);
                }
            };

            service.capturarFotoFile = function (listener) {
                if (service.loadCamera()) {

                    var options = {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.FILE_URL
                    };
                    service.exec(options, listener);
                } else {
                    listener(null);
                }
            };
            return service;
        });
