angular.module('starter')
        .factory('LoadModuloFactory',
                function ($ionicLoading, ValidacaoModuloFactory) {

                    var services = {};

                    services.show = function () {
                        $ionicLoading.show({
                            template: '<div><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><div class="padding-top">Aguarde ...</div></div>'
                        }).then(function () {
                            console.log("Iniciando o loading.");
                        });
                    };
                    services.hide = function () {
                        $ionicLoading.hide().then(function () {
                            console.log("Finalizando o loading.");
                        });
                    };

                    services.mapa = function (cliente, scope) {
                        console.log('Carregar Mapa');
                        if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                            var div = document.getElementById("map_canvas");
                            var latLong = new google.maps.LatLng(cliente.latitude, cliente.longitude);
                            var mapOptions = {
                                center: latLong,
                                zoom: 18,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                                        //streetViewControl: false,
                                        //mapTypeControl: false
                            };

                            var map = new google.maps.Map(div, mapOptions);
                            var marker = new google.maps.Marker({
                                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                position: latLong,
                                map: map
                            });

                        } else {
                            scope.show_mapa = 0;
                            ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                        }
                    }

                    return services;
                }
        );