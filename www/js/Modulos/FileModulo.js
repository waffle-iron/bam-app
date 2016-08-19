angular.module('starter')
        .factory('FileModuloFactory', function (Config, StorageModuloFactory, $cordovaFileTransfer, $cordovaFile) {
            var service = {};

            service.upload = function (url, targetPath, options, listener) {
                var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
                var filename = targetPath.substr(targetPath.lastIndexOf('/') + 1);
                options = angular.merge({
                    fileKey: "file",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpg",
                    params: {}
                }, options);

                $cordovaFileTransfer.upload(Config.url + Config.api + url + '?_token=' + user.token, targetPath, options).then(function (result) {
                    listener(result);
                }, function (err) {
                    listener(null);
                }, function (progress) {
                    console.log("PROGRESS: " + JSON.stringify(progress));
                });
            };

            service.remove = function (file, listener) {
                var filename = file.substr(file.lastIndexOf('/') + 1);
                var dir = file.replace(filename, '');
                $cordovaFile.removeFile(dir, filename)
                        .then(function (success) {
                            listener(true);
                        }, function (error) {
                            listener(false);
                        });

            }
            return service;
        });
