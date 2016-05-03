'use strict';

const http = require('http');
const path = require('path');

const conf = require('./conf/config');
const log = require('./util/logger');
const RouteDispatcher = require('./server/RouteDispatcher');
const BodyParser = require('./server/BodyParser');
const SendFile = require('./server/SendFile');
const RequestAuthenticationChecker = require('./server/RequestAuthenticationChecker');

var dispatcher = new RouteDispatcher();

//
//incoming request logging
//
dispatcher.add(function(req, res, next) {
    log.debug('Incoming Request: ' + req.method + ' ' + req.url);
    next();
});

BodyParser.init(dispatcher);

//
// Security checker
//
var requestChecker = RequestAuthenticationChecker.createChecker(conf.RequestAuthenticationChecker);
dispatcher.add(new RegExp('^/v1/configurations(.*)'), requestChecker);

//
//application routes
//
var controllerConfig = conf.controllers || {};
require('./controllers/AuthenticationController').create(dispatcher, controllerConfig['Authentication']);
require('./controllers/ConfigurationController').create(dispatcher, controllerConfig['Configuration']);

//
// Test client
//
dispatcher.add('/', 'GET', SendFile.send(path.join(__dirname, 'client/test.html')));

//
//NOT FOUND handler, register after all other routes
//
dispatcher.add(function(req, res) {
    log.info('NOT found Request: ' + req.method + ' ' + req.url);
    res.statusCode = 404;
    res.end('Not Found');
});

//
// Start server
//
var server = http.createServer(dispatcher.handle.bind(dispatcher));
var port = conf.http.port || 8080;
server.listen(port,function() {
   log.info('Server listening on port: ' + port);
});
