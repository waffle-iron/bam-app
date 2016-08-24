angular.module('starter')
        .factory('ValidacaoModuloFactory',
                function ($ionicPopup) {

                    var services = {};

                    services.status = {
                        code: {
                            OK: 200,
                            CREATE: 201,
                            PARCIAL: 206,
                            NOT: 204,
                            ERROR: 412,
                            SEM_PERMISSAO: 401
                        }
                    };

                    services.isOk = function (status) {
                        return (services.is('OK', status) || services.is('CREATE', status) || services.is('PARCIAL', status));
                    };

                    services.isCreate = function (status) {
                        return services.is('CREATE', status);
                    };

                    services.isParcial = function (status) {
                        return services.is('PARCIAL', status);
                    };

                    services.isNot = function (status) {
                        return services.is('NOT', status);
                    };

                    services.isError = function (status) {
                        return services.is('ERROR', status);
                    };

                    services.isPermissao = function (status) {
                        return services.is('SEM_PERMISSAO', status);
                    };

                    services.is = function (type, status) {
                        if (services.status.code[type] === status) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    services.isNotNull = function (val) {
                        if (angular.isArray(val)) {
                            if (services.count(val) > 0) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (angular.isObject(val)) {
                            if (services.count(val) > 0) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (angular.isString(val)) {
                            if (val.toUpperCase() === 'NULL' || val.toUpperCase() === 'UNDEFINED') {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return !!val;
                    };

                    /*services.empty = function (val) {
                     if(val === null){
                     return true;
                     } else if(val === ''){
                     return true;
                     } else if(val === 'undefined'){
                     return true;
                     } else if(val === undefined){
                     return true;
                     } else {
                     return false;
                     }
                     };*/

                    services.alert = function (msg) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Aviso!',
                            template: '<div class="text-center">' + msg + '</div>'
                        });

                        alertPopup.then(function (res) {

                        });
                    };

                    services.count = function (mixedVar, mode) {
                        var key
                        var cnt = 0

                        if (mixedVar === null || typeof mixedVar === 'undefined') {
                            return 0
                        } else if (mixedVar.constructor !== Array && mixedVar.constructor !== Object) {
                            return 1
                        }

                        if (mode === 'COUNT_RECURSIVE') {
                            mode = 1
                        }
                        if (mode !== 1) {
                            mode = 0
                        }

                        for (key in mixedVar) {
                            if (mixedVar.hasOwnProperty(key)) {
                                cnt++
                                if (mode === 1 && mixedVar[key] &&
                                        (mixedVar[key].constructor === Array ||
                                                mixedVar[key].constructor === Object)) {
                                    cnt += count(mixedVar[key], 1)
                                }
                            }
                        }

                        return cnt
                    };

                    services.empty = function (mixedVar) {
                        var undef
                        var key
                        var i
                        var len
                        var emptyValues = [undef, null, false, 0, '', '0']

                        for (i = 0, len = emptyValues.length; i < len; i++) {
                            if (mixedVar === emptyValues[i]) {
                                return true
                            }
                        }

                        if (typeof mixedVar === 'object') {
                            for (key in mixedVar) {
                                if (mixedVar.hasOwnProperty(key)) {
                                    return false
                                }
                            }
                            return true
                        }

                        return false
                    };

                    services.is_numeric = function (mixedVar) {
                        var whitespace = [
                            ' ',
                            '\n',
                            '\r',
                            '\t',
                            '\f',
                            '\x0b',
                            '\xa0',
                            '\u2000',
                            '\u2001',
                            '\u2002',
                            '\u2003',
                            '\u2004',
                            '\u2005',
                            '\u2006',
                            '\u2007',
                            '\u2008',
                            '\u2009',
                            '\u200a',
                            '\u200b',
                            '\u2028',
                            '\u2029',
                            '\u3000'
                        ].join('')

                        // @todo: Break this up using many single conditions with early returns
                        return (typeof mixedVar === 'number' ||
                                (typeof mixedVar === 'string' &&
                                        whitespace.indexOf(mixedVar.slice(-1)) === -1)) &&
                                mixedVar !== '' &&
                                !isNaN(mixedVar)
                    };

                    services.trim = function (str, charlist) {
                        var whitespace = [
                            ' ',
                            '\n',
                            '\r',
                            '\t',
                            '\f',
                            '\x0b',
                            '\xa0',
                            '\u2000',
                            '\u2001',
                            '\u2002',
                            '\u2003',
                            '\u2004',
                            '\u2005',
                            '\u2006',
                            '\u2007',
                            '\u2008',
                            '\u2009',
                            '\u200a',
                            '\u200b',
                            '\u2028',
                            '\u2029',
                            '\u3000'
                        ].join('')
                        var l = 0
                        var i = 0
                        str += ''

                        if (charlist) {
                            whitespace = (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '$1')
                        }

                        l = str.length
                        for (i = 0; i < l; i++) {
                            if (whitespace.indexOf(str.charAt(i)) === -1) {
                                str = str.substring(i)
                                break
                            }
                        }

                        l = str.length
                        for (i = l - 1; i >= 0; i--) {
                            if (whitespace.indexOf(str.charAt(i)) === -1) {
                                str = str.substring(0, i + 1)
                                break
                            }
                        }

                        return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
                    };

                    return services;
                }
        );
