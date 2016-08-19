angular.module('starter')
        .directive('footerAcoes', function () {
            var ddo = {};
            ddo.restrict = "AE";
            ddo.transclude = true;
            ddo.templateUrl = ('templates/directive/footer-acoes.html');
            return ddo;
        })
        .directive('headerLogo', function () {
            var ddo = {};
            ddo.restrict = "AE";
            ddo.transclude = true;
            ddo.templateUrl = ('templates/directive/header-logo.html');
            return ddo;

        })
        .directive('headerLogoMini', function () {
            var ddo = {};
            ddo.restrict = "AE";
            ddo.transclude = true;
            ddo.templateUrl = ('templates/directive/header-logo-mini.html');
            return ddo;

        })
        .directive('msg', function () {
            var ddo = {};
            ddo.restrict = "AE";
            ddo.transclude = true;
            ddo.templateUrl = ('templates/directive/msg.html');
            return ddo;

        })

        .directive('stringToNumber', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function (value) {
                        return '' + value;
                    });
                    ngModel.$formatters.push(function (value) {
                        return parseFloat(value);
                    });
                }
            };
        })

        ;