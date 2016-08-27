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
                            navigator.geolocation.getCurrentPosition(function (position) {
                                console.log('Pegando posição do Device.');
                                console.log(JSON.stringify(position));
                                var div = document.getElementById("map_canvas");
                                // var latLong = new google.maps.LatLng(cliente.latitude, cliente.longitude);
                                var mapOptions = {
                                    //center: latLong,
                                    zoom: 18,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };

                                var map = new google.maps.Map(div, mapOptions);

                                var markers = [];

                                // Add the markers and infowindows to the map
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                    map: map,
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                });

                                markers.push(marker);

                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(cliente.latitude, cliente.longitude),
                                    map: map,
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                });

                                markers.push(marker);


                                function autoCenter() {
                                    //  Create a new viewpoint bound
                                    var bounds = new google.maps.LatLngBounds();
                                    //  Go through each...
                                    for (var i = 0; i < markers.length; i++) {
                                        bounds.extend(markers[i].position);
                                    }
                                    //  Fit these bounds to the map
                                    map.fitBounds(bounds);
                                }
                                autoCenter();


                            }, function (error) {
                                console.log('Não foi possivel pegar a posição do Device.');
                                console.log(JSON.stringify(error));
                                var div = document.getElementById("map_canvas");
                                var latLong = new google.maps.LatLng(cliente.latitude, cliente.longitude);
                                var mapOptions = {
                                    center: latLong,
                                    zoom: 18,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };

                                var map = new google.maps.Map(div, mapOptions);
                                var marker = new google.maps.Marker({
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                    position: latLong,
                                    map: map
                                });
                            },
                                    {
                                        timeout: 10000,
                                        enableHighAccuracy: false
                                    });

                        } else {
                            scope.show_mapa = 0;
                            ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                        }
                    }

                    return services;
                }
        );