angular.module('starter')
        .factory('NavegacaoModuloFactory',
                function ($state) {

                    var services = {
                        enum: {
                            login: 'app.login',
                            home: 'app.home',
                            checkin: 'app.checkin',
                            rotaBam: 'app.rota_bam',
                            programaMercado: 'app.programa_mercado',
                            ativacao52: 'app.ativacao_52',
                            inicializacao: 'app.inicializacao',
                            ocorrencias: 'app.ocorrencias',
                            cervejas: 'app.cervejas',
                            upload: 'app.upload',
                            logout: 'app.logout'
                        }
                    };

                    services.go = function (url) {
                        $state.go(url);
                    };

                    return services;
                }
        );