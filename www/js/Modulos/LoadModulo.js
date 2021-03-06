angular.module('starter')
        .factory('LoadModuloFactory',
                function ($ionicLoading, ValidacaoModuloFactory, $window, StorageModuloFactory, Config) {

                    var services = {};

                    services.show = function () {
                        $ionicLoading.show({
                            template: '<div><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><div class="padding-top">Aguarde ...</div></div>'
                        }).then(function () {
                        });
                    };
                    services.hide = function () {
                        $ionicLoading.hide().then(function () {
                        });
                    };

                    services.mapa = function (cliente, scope) {
                        if (ValidacaoModuloFactory.isNotNull(cliente.latitude) && ValidacaoModuloFactory.isNotNull(cliente.longitude)) {
                            scope.show_mapa = 1;
                            navigator.geolocation.getCurrentPosition(function (position) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.latitude, position.coords.latitude);
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.longitude, position.coords.longitude);
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
                                    icon: Config.url + 'img/icon-mapas/ico_bam.png'
                                });

                                markers.push(marker);

                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(cliente.latitude, cliente.longitude),
                                    map: map,
                                    icon: Config.url + 'img/icon-mapas/icon_pdv.png'
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
                                scope.show_mapa = 1;

                            }, function (error) {
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.latitude, null);
                                StorageModuloFactory.local.set(StorageModuloFactory.enum.longitude, null);
                                var div = document.getElementById("map_canvas");
                                var latLong = new google.maps.LatLng(cliente.latitude, cliente.longitude);
                                var mapOptions = {
                                    center: latLong,
                                    zoom: 18,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };

                                var map = new google.maps.Map(div, mapOptions);
                                var marker = new google.maps.Marker({
                                    icon: Config.url + 'img/icon-mapas/icon_pdv.png',
                                    position: latLong,
                                    map: map
                                });
                                scope.show_mapa = 1;
                            },
                                    {
                                        timeout: 10000,
                                        enableHighAccuracy: false
                                    });

                        } else {
                            scope.show_mapa = 0;
                            //ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa.');
                        }
                    }
                    services.mapaAll = function (clientes, scope) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.latitude, position.coords.latitude);
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.longitude, position.coords.longitude);
                            var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
                            var div = document.getElementById("map_canvas");
                            div.style.height = (($window.innerHeight - 80)) + 'px';
                            var mapOptions = {
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };

                            var map = new google.maps.Map(div, mapOptions);
                            var infowindow = new google.maps.InfoWindow();
                            var i;

                            var markers = [];

                            // Add the markers and infowindows to the map
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                map: map,
                                icon: Config.url + 'img/icon-mapas/ico_bam.png'
                            });

                            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                                return function () {
                                    infowindow.setContent('<div><div><img src="' + user.url + '" style="max-width: 100px;" /></div><div>' + user.nome + '</div></div>');
                                    infowindow.open(map, marker);
                                }
                            })(marker, i));
                            markers.push(marker);

                            var selectIcon = function (total) {
                                if (total >= 2) {
                                    return 'icon_green.png';
                                } else if (total > 0) {
                                    return 'icon_yellow.png';
                                } else {
                                    return 'icon_grey.png';
                                }
                            }

                            angular.forEach(clientes, function (v, k) {
                                if (ValidacaoModuloFactory.isNotNull(v.latitude) && ValidacaoModuloFactory.isNotNull(v.longitude)) {
                                    marker = new google.maps.Marker({
                                        position: new google.maps.LatLng(v.latitude, v.longitude),
                                        map: map,
                                        icon: Config.url + 'img/icon-mapas/' + selectIcon(v.checkin),
                                        title: v.nome
                                    });
                                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                                        return function () {
                                            infowindow.setContent('<a href="#/app/cliente/' + v.id + '"><div><img src="' + v.url + '" style="max-width: 100px;" /></div><div>' + v.nome + '</div></a>');
                                            infowindow.open(map, marker);
                                        }
                                    })(marker, i));
                                    markers.push(marker);
                                }
                            });
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
                            scope.show_mapa = 1;

                        }, function (error) {
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.latitude, null);
                            StorageModuloFactory.local.set(StorageModuloFactory.enum.longitude, null);
                            scope.show_mapa = 0;
                            ValidacaoModuloFactory.alert('Não foi possivel carregar o mapa, Verifique se o GPS de seu aparelho esta ativo e com conexão com a Internet.');
                        },
                                {
                                    timeout: 10000,
                                    enableHighAccuracy: false
                                });


                    }

                    return services;
                }
        );