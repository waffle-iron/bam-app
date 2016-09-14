angular.module('starter')
        .factory('CameraModuloFactory', function ($cordovaCamera, $cordovaFile) {
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
                        targetWidth: 600,
                        targetHeight: 400,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false,
                        correctOrientation: true,
                        cameraDirection: 1
                    }, options);
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        if (options.destinationType === Camera.DestinationType.DATA_URL) {
                            if (Camera.EncodingType.JPEG === options.encodingType) {
                                listener("data:image/jpeg;base64," + imageData);
                            } else {
                                listener("data:image/png;base64," + imageData);
                            }
                        } else {
                            //service.moveToImage(imageData, listener);
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

            service.moveToImage = function (imagePath, listener) {
                console.log(imagePath);
                console.log(JSON.stringify(cordova.file));
                //Grab the file name of the photo in the temporary directory
                var currentName = imagePath.replace(/^.*[\\\/]/, '');
                console.log(currentName);

                //Create a new name for the photo
                var d = new Date(),
                        n = d.getTime(),
                        newFileName = n + ".jpg";

                //Move the file to permanent storage
                $cordovaFile.moveFile(cordova.file.externalCacheDirectory, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                    console.log('success');
                    console.log(JSON.stringify(success));
                    //success.nativeURL will contain the path to the photo in permanent storage, do whatever you wish with it, e.g:
                    //createPhoto(success.nativeURL);
                    listener(success.nativeURL);

                }, function (error) {
                    console.log('error');
                    console.log(JSON.stringify(error));
                    //an error occured
                });
            }
            return service;
        });
