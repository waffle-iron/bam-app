angular.module('starter')
        .factory('FileModuloFactory', function (Base64ModuloFactory, Config, StorageModuloFactory, $cordovaFileTransfer, $cordovaFile) {
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
                });
            };


            service.loadImg = function (filename, callback) {
                $cordovaFile.readAsText(filename).then(function (result) {
                    console.log('readAsText Success');
                    items = JSON.parse(result);
                    callback(items);
                }, function () {
                    console.log('readAsText Failed');
                    callback({});
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

            service.asUrl = function (path, callback) {
                window.resolveLocalFileSystemURL(path, gotFile, fail);

                function fail(e) {
                    alert('Cannot found requested file');
                }

                function gotFile(fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            console.log('gotFile');
                            console.log(JSON.stringify(e));
                            console.log(JSON.stringify(this.result));
                            var content = this.result;
                            callback(content);
                        };
                        // The most important point, use the readAsDatURL Method from the file plugin
                        reader.readAsDataURL(file);
                    });
                }
            }

            return service;
        });
