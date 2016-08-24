// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'angularMoment', 'n3-pie-chart'])
        .constant('Config', {
            url: 'http://bptech.web1611.kinghost.net/',
            //url: 'http://bptech.web1611.kinghost.net/',
            api: 'api/',
            userLogin: 'admin',
            userSenha: '123456',
            timeout: 15000,
            database: 'bam'
        })
        .run(function ($ionicPlatform, $rootScope, NavegacaoModuloFactory, Config) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

            });

            $rootScope.go = function (url) {
                NavegacaoModuloFactory.go(url);
            };

        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $ionicConfigProvider.backButton.previousTitleText(false);
            $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
            if (ionic.Platform.isAndroid()) {
                $ionicConfigProvider.scrolling.jsScrolling(true);
            }
            //$ionicConfigProvider.views.forwardCache(true);
            //$ionicConfigProvider.views.maxCache(0);
            //$ionicConfigProvider.views.transition('none');
            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.login', {
                        url: '/login',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/login.html',
                                controller: 'LoginCtrl'
                            }
                        }
                    })

                    .state('app.logout', {
                        url: '/logout',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/login.html',
                                controller: 'LogoutCtrl'
                            }
                        }
                    })

                    .state('app.inicializacao', {
                        url: '/inicializacao',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/inicializacao.html',
                                controller: 'InicializacaoCtrl'
                            }
                        }
                    })

                    .state('app.upload', {
                        url: '/upload',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/upload.html',
                                controller: 'UploadCtrl'
                            }
                        }
                    })

                    .state('app.home', {
                        url: '/home',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/home.html',
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('app.ocorrencias', {
                        url: '/ocorrencias/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/ocorrencias.html',
                                controller: 'OcorrenciasCtrl'
                            }
                        }
                    })

                    .state('app.orientacao', {
                        url: '/orientacao',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/orientacao.html',
                                controller: 'OrientacaoCtrl'
                            }
                        }
                    })

                    .state('app.orientacaoDetalhes', {
                        url: '/orientacaoDetalhes/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/orientacao-detalhes.html',
                                controller: 'OrientacaoDetalhesCtrl'
                            }
                        }
                    })

                    .state('app.bibliotecas', {
                        url: '/bibliotecas',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bibliotecas.html',
                                controller: 'BibliotecasCtrl'
                            }
                        }
                    })

                    .state('app.bibliotecasDetalhes', {
                        url: '/bibliotecasDetalhes/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bibliotecas-detalhes.html',
                                controller: 'BibliotecasDetalhesCtrl'
                            }
                        }
                    })

                    .state('app.notificacoes', {
                        url: '/notificacoes',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/notificacoes.html',
                                controller: 'NotificacoesCtrl'
                            }
                        }
                    })

                    .state('app.notificacoesDetalhes', {
                        url: '/notificacoesDetalhes/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/notificacoes-detalhes.html',
                                controller: 'NotificacoesDetalhesCtrl'
                            }
                        }
                    })

                    .state('app.cervejas', {
                        url: '/cervejas',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cervejas.html',
                                controller: 'CervejasCtrl'
                            }
                        }
                    })

                    .state('app.rota_bam', {
                        url: '/rota_bam',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/rota_bam.html',
                                controller: 'RotaBamCtrl'
                            }
                        }
                    })

                    .state('app.ativacao_52', {
                        url: '/ativacao_52',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/ativacao_52.html',
                                controller: 'Ativacao52Ctrl'
                            }
                        }
                    })

                    .state('app.programa_mercado', {
                        url: '/programa_mercado',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/programa_mercado.html',
                                controller: 'ProgramaMercadoCtrl'
                            }
                        }
                    })

                    .state('app.checkin', {
                        url: '/checkin',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/checkin.html',
                                controller: 'CheckInCtrl'
                            }
                        }
                    })

                    .state('app.cliente', {
                        url: '/cliente/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cliente.html',
                                controller: 'ClienteCtrl'
                            }
                        }
                    })

                    .state('app.cliente_edit', {
                        url: '/cliente_edit/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cliente_edit.html',
                                controller: 'ClienteEditCtrl'
                            }
                        }
                    })

                    .state('app.cliente_relatorio', {
                        url: '/cliente_relatorio/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cliente_relatorio.html',
                                controller: 'ClienteRelatorioCtrl'
                            }
                        }
                    })

                    .state('app.bam', {
                        url: '/bam',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bam.html',
                                controller: 'BamCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/login');
        });
