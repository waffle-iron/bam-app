var debug = function(str){
    console.log(JSON.stringify(str));
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'angularMoment', 'n3-pie-chart', 'fcsa-number'])
        .constant('Config', {
            url: 'http://45.55.69.61/bam/',
            api: 'api/',
            versaoApp: '01.00.29',
            userLogin: 'admin',
            userSenha: '123456',
            timeout: 35000,
            database: 'bam',
            debug: true,
            avisoSemConexao: 'Essa página necessita de conexão com a internet para ser exibida.',
            avisoGpsInattivo: 'Verifique se o seu GPS esta ativo e com conexão com a internet para trazer os clientes mais próximo à você.'
        })
        .run(function ($cordovaDevice, $ionicPlatform, $rootScope, NavegacaoModuloFactory, StorageModuloFactory, Config, ClientesTable) {
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

            $rootScope.go = function (url, params) {
                NavegacaoModuloFactory.go(url, params);
            };
            $rootScope.versaoApp = Config.versaoApp;
            $rootScope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            $rootScope.atualizarUser = function () {
                $rootScope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            };

            $rootScope.setAtualizarUser = function (result) {
                StorageModuloFactory.local.setObject(StorageModuloFactory.enum.user, result);
                var adicionais = function () {
                    document.addEventListener("deviceready", function () {
                        var user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
                        user = angular.merge(user, {
                            cordova: $cordovaDevice.getCordova(),
                            model: $cordovaDevice.getModel(),
                            platform: $cordovaDevice.getPlatform(),
                            uuid: $cordovaDevice.getUUID(),
                            version: $cordovaDevice.getVersion(),
                            versao_app: Config.versaoApp
                        });
                        StorageModuloFactory.local.setObject(StorageModuloFactory.enum.user, user);
                        console.log(JSON.stringify(user));
                    }, false);
                }
                adicionais();
                $rootScope.user = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.user);
            };

            $rootScope.atualizarPDV = function () {
                var cliente = StorageModuloFactory.local.getObject(StorageModuloFactory.enum.pdvAtivo);
                ClientesTable.get('id', cliente.id, function (ret) {
                    StorageModuloFactory.local.setObject(StorageModuloFactory.enum.pdvAtivo, ret);
                });
            };
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $ionicConfigProvider.backButton.previousTitleText(false);
            $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
            if (ionic.Platform.isAndroid()) {
                $ionicConfigProvider.scrolling.jsScrolling(true);
            }
            $ionicConfigProvider.views.forwardCache(false);
            $ionicConfigProvider.views.maxCache(0);
            $ionicConfigProvider.views.transition('none');
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
                                templateUrl: 'templates/orientacao_detalhes.html',
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
                                templateUrl: 'templates/bibliotecas_detalhes.html',
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
                                templateUrl: 'templates/notificacoes_detalhes.html',
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

                    .state('app.rota_bam_resumo', {
                        url: '/rota_bam_resumo',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/rota_bam_resumo.html',
                                controller: 'RotaBamResumoCtrl'
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

                    .state('app.programa_mercado_resumo', {
                        url: '/programa_mercado_resumo',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/programa_mercado_resumo.html',
                                controller: 'ProgramaMercadoResumoCtrl'
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

                    .state('app.mapa_all', {
                        url: '/mapa_all',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/mapa_all.html',
                                controller: 'MapaAllCtrl'
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

                    .state('app.usuario_edit', {
                        url: '/usuario_edit',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/usuario_edit.html',
                                controller: 'UsuarioCtrl'
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

                    .state('app.cliente_relatorio_historico', {
                        url: '/cliente_relatorio_historico/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cliente_relatorio_historico.html',
                                controller: 'ClienteHistoricoCtrl'
                            }
                        }
                    })

                    .state('app.cliente_relatorio_historico_respostas', {
                        url: '/cliente_relatorio_historico_respostas/:id/:data/:tipo',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/cliente_relatorio_historico_respostas.html',
                                controller: 'ClienteHistoricoRespostasCtrl'
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

                    .state('app.bam_historico', {
                        url: '/bam_historico',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bam_historico.html',
                                controller: 'BamHistoricoCtrl'
                            }
                        }
                    })

                    .state('app.bam_rac_ranking', {
                        url: '/bam_rac_ranking',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bam_rac_ranking.html',
                                controller: 'BamCtrl'
                            }
                        }
                    })

                    .state('app.bam_resposta_selecionada', {
                        url: '/bam_resposta_selecionada/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/bam_resposta_selecionada.html',
                                controller: 'BamRespostaSelecionadaCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/login');
        });
