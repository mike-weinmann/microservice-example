/**
 * Dispatcher tests
 */
 
'use strict';

const assert = require(fromBase('test/_lib/assert'));
const RouteDispatcher = require(fromBase('server/RouteDispatcher'));

/**
 * Tests
 */
module.exports = {
    noRoutes: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.handle({method: 'GET', url: '/'}, {});
    },

    oneRoute: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', function(req, res) {
           res.count = 1;
        });

        var testRequest = {method: 'GET', url: '/'};
        var testResponse = {};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
    },

    oneRouteWithMissingNext: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', function(req, res, next) {
            res.count = 1;
            next();
        });

        var testRequest = {method: 'GET', url: '/'};
        var testResponse = {};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
    },

    twoRoutes: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', function(req, res, next) {
            res.count = 1;
            next();
        });
        dispatcher.add('/', function(req, res) {
            res.count2 = 2;
        });

        var testRequest = {method: 'GET', url: '/'};
        var testResponse = {};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
        assert.areEqual(2, testResponse.count2, 'Second handler missing');
    },

    twoRoutesWithExtra: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/3', function(req, res, next) {
            res.count3 = 3;
            next();
        });
        dispatcher.add('/', function(req, res, next) {
            res.count = 1;
            next();
        });
        dispatcher.add('/4', function(req, res, next) {
            res.count4 = 4;
            next();
        });
        dispatcher.add('/', function(req, res) {
            res.count2 = 2;
        });

        var testRequest = {method: 'GET', url: '/'};
        var testResponse = {count3: -1, count4: -1};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
        assert.areEqual(2, testResponse.count2, 'Second handler missing');
        assert.areEqual(-1, testResponse.count3, 'Third handler called');
        assert.areEqual(-1, testResponse.count4, 'Fourth handler called');
    },

    regExpRouting: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add(/\/abc.*/, function(req, res, next) {
            res.count = 1;
            next();
        });
        dispatcher.add(/\/def.*/, function(req, res, next) {
            res.count2 = 2;
            next();
        });

        var testRequest = {method: 'GET', url: '/abc'};
        var testResponse = {count: -1, count2: -1};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
        assert.areEqual(-1, testResponse.count2, 'Second handler called');
    },

    routeWithMethod: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', 'GET', function(req, res) {
            res.count = 1;
        });

        var testRequest = {method: 'GET', url: '/'};
        var testResponse = {};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
    },

    routeWithMethodNoMatch: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', 'GET', function(req, res) {
            res.count = 1;
        });

        var testRequest = {method: 'POST', url: '/'};
        var testResponse = {count: -1};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(-1, testResponse.count, 'GET handler called');
    },

    routeWithQuery: function() {
        var dispatcher = new RouteDispatcher();
        dispatcher.add('/', 'GET', function(req, res) {
            res.count = 1;
        });

        var testRequest = {method: 'GET', url: '/?a=b'};
        var testResponse = {};
        dispatcher.handle(testRequest, testResponse);
        assert.areEqual(1, testResponse.count, 'First handler missing');
    }
};

