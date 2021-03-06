/*
* mail/pops/index.js                              Copyright(c) 2017 cPanel, Inc.
*                                                           All rights Reserved.
* copyright@cpanel.net                                         http://cpanel.net
* This code is subject to the cPanel license. Unauthorized copying is prohibited
*/

/* global require: false, define: false, PAGE: false */

define(
    [
        "angular",
        "cjt/modules",
        "jquery-chosen",
        "angular-chosen",
        "ngRoute"
    ],
    function(angular) {
        "use strict";
        return function() {

            // First create the application
            angular.module("cpanel.mail.Pops", [
                "angular-growl",
                "cjt2.cpanel",
                "cjt2.services.api",
                "cjt2.views.applicationController",
                "ngAnimate",
                "localytics.directives",
                "cjt2.directives.bytesInput",
                "cjt2.services.alert"
            ]);

            // Then load the application dependencies
            var app = require([
                "cjt/bootstrap",
                "app/services/emailAccountsService",
                "app/filters/emailLocaleString",
                "app/filters/encodeURIComponent",
                "app/filters/quotaProgressType",
                "app/views/listEmailAccounts",
                "app/views/addEmailAccount",
                "app/views/configurationOptions",
                "app/views/defaultAccount"
            ], function(BOOTSTRAP) {

                var app = angular.module("cpanel.mail.Pops");

                app.constant("ONE_MEBIBYTE", 1048576);
                app.config(["$animateProvider", "$routeProvider",
                    function($animateProvider, $routeProvider) {

                        $animateProvider.classNameFilter(/(action-module|disappearing-table-row|animated-view)/);

                        $routeProvider.when("/addEmailAccount", {
                            controller: "addEmailAccountCtrl",
                            templateUrl: "views/addEmailAccount.ptt"
                        });

                        $routeProvider.when("/listEmailAccounts/:account?", {
                            controller: "listEmailAccountsCtrl",
                            templateUrl: "views/listEmailAccounts.ptt"
                        });

                        if ( window.PAGE.defaultAccountEnabled ) {
                            $routeProvider.when("/defaultAccount", {
                                controller: "defaultAccountCtrl",
                                templateUrl: "views/defaultAccount.ptt"
                            });
                        }

                        if ( window.PAGE.showConfigSection ) {
                            $routeProvider.when("/configurationOptions", {
                                controller: "configurationOptionsCtrl",
                                templateUrl: "views/configurationOptions.ptt"
                            });
                        }

                        $routeProvider.otherwise("/listEmailAccounts");
                    }
                ]);

                var tabs = {
                    "/addEmailAccount": 0,
                    "/listEmailAccounts": 1,
                    "/defaultAccount": 2,
                    "/configurationOptions": 3
                };

                app.controller("baseController",
                    ["$rootScope", "$location", "$scope",
                        function($rootScope, $location, $scope) {

                            $rootScope.initialLoad = true;

                            $scope.pageTabs = [];
                            $scope.loading = true;
                            $scope.activeTab = -1;
                            $scope.showDefaultAccount = window.PAGE.defaultAccountEnabled;
                            $scope.showConfigSection = window.PAGE.showConfigSection;

                            $rootScope.$on("$routeChangeStart", function() {
                                $scope.loading = true;
                            });

                            $rootScope.$on("$routeChangeSuccess", function() {
                                $scope.loading = false;

                                if ( $location.path().indexOf("/listEmailAccounts") > -1 ) {
                                    $scope.activeTab = tabs["/listEmailAccounts"];
                                    $rootScope.createdAccounts = 0;
                                } else {
                                    $scope.activeTab = tabs[$location.path()];
                                }

                            });

                            $rootScope.$on("$routeChangeError", function() {
                                $scope.loading = false;
                            });

                            $scope.go = function(path) {
                                $location.path(path);
                            };

                        }]
                );

                app.animation(".action-module", ["$animateCss", function($animateCss) {
                    return {
                        enter: function(elem, done) {
                            var height = elem[0].offsetHeight;
                            return $animateCss(elem, {
                                from: { height: "0" },
                                to: { height: height + "px" },
                                duration: 0.3,
                                easing: "ease-out",
                                event: "enter",
                                structural: true
                            })
                                .start()
                                .done(function() {
                                    elem[0].style.height = "";
                                    done();
                                });
                        },
                        leave: function(elem, done) {
                            var height = elem[0].offsetHeight;
                            return $animateCss(elem, {
                                event: "leave",
                                structural: true,
                                from: { height: height + "px" },
                                to: { height: "0" },
                                duration: 0.3,
                                easing: "ease-out",
                            })
                                .start()
                                .done(function() {
                                    done();
                                });
                        },
                    };
                }]);

                BOOTSTRAP("#body-content", "cpanel.mail.Pops");
            });

            return app;
        };
    }
);
