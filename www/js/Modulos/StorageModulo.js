angular.module('starter')
        .factory('StorageModuloFactory',
                function () {

                    var services = {
                        local: {},
                        session: {},
                        enum: {
                            user: 'user',
                            sincronizacaoInicial: 'sincronizacao_inicial',
                            home: 'home',
                            inicializacao: 'inicializacao',
                            upload: 'upload',
                            pdvAtivo: 'pdv_ativo',
                            hasSincronizacao: 'has_sincronizacao',
                            forceLoginSincronizacao: 'force_login_sincronizacao',
                            forceLogoutSincronizacao: 'force_logout_sincronizacao',
                            latitude: 'latitude',
                            longitude: 'longitude'
                        }
                    };

                    services.local.get = function (k, d) {
                        d = d || null;
                        var v = window.localStorage.getItem(k);
                        return v || d;
                    };
                    
                    services.local.set = function (k, v) {
                        window.localStorage.setItem(k, v);
                        return v;
                    };
                    
                    services.local.delete = function (k) {
                        window.localStorage.removeItem(k);
                        return null;
                    };
                    
                    services.local.destroy = function () {
                        window.localStorage.clear();
                        return null;
                    };

                    services.local.getObject = function (k, d) {
                        d = d || {};
                        var v = JSON.parse(window.localStorage.getItem(k));
                        return v || d;
                    };
                    
                    services.local.setObject = function (k, v) {
                        window.localStorage.setItem(k, JSON.stringify(v));
                        return v;
                    };

                    services.session.get = function (k, d) {
                        d = d || null;
                        var v = window.sessionStorage.getItem(k);
                        return v || d;
                    };
                    
                    services.session.set = function (k, v) {
                        window.sessionStorage.setItem(k, v);
                        return v;
                    };
                    
                    services.session.delete = function (k) {
                        window.sessionStorage.removeItem(k);
                        return null;
                    };
                    
                    services.session.destroy = function () {
                        window.sessionStorage.clear();
                        return null;
                    };

                    services.session.getObject = function (k, d) {
                        d = d || {};
                        var v = JSON.parse(window.sessionStorage.getItem(k));
                        return v || d;
                    };
                    
                    services.session.setObject = function (k, v) {
                        window.sessionStorage.setItem(k, JSON.stringify(v));
                        return v;
                    };

                    services.setFlash = function (v) {
                        window.sessionStorage.setItem('hasFlash', v);
                        return v;
                    };

                    services.getFlash = function () {
                        var v = window.sessionStorage.getItem('hasFlash');
                        window.sessionStorage.removeItem('hasFlash');
                        return v || null;
                    };

                    return services;
                }
        );