/*
# zone_editor/services/features.js                Copyright(c) 2016 cPanel, Inc.
#                                                           All rights Reserved.
# copyright@cpanel.net                                         http://cpanel.net
# This code is subject to the cPanel license. Unauthorized copying is prohibited
*/

/* global define: false */

define(
    [
        "angular"
    ],
    function(angular) {

        var app = angular.module("cpanel.zoneEditor");
        var factory = app.factory("Features", ["defaultInfo", function(defaultInfo) {

            var store = {};

            store.dnssec = false;
            store.mx = false;
            store.simple = false;
            store.advanced = false;

            store.init = function() {
                store.dnssec = defaultInfo.has_dnssec_feature;
                store.mx = defaultInfo.has_mx_feature;
                store.simple = defaultInfo.has_simple_feature;
                store.advanced = defaultInfo.has_adv_feature;
            };

            store.init();

            return store;
        }]);

        return factory;
    }
);
