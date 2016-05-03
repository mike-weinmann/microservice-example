'use strict';
var log = require('../util/logger');

/**
 * Simple HTTP Route Dispatcher based on request method and URL
 * (Similar to express, but much more simple)
 *
 * Also adds utility methods to request/response prior to dispatching
 *  response.sendJSON
 *
 * @constructor
 */
function RouteDispatcher() {
    //
    // NOTE: All routes are stored in a single way.
    // If the number of routes becomes large, performance will suffer
    //
    this._routes = [];
}

/**
 * Adds the route to the handler
 * @param (optional) url HTTP request URL (string or regex)
 * @param (optional) method HTTP method
 * @param handler
 *  Handler to call for matching request.
 *  Should take the following parameters:
 *      request - Incoming request object
 *      response - Outgoing request
 *      next - Call to next in chain if not handled.
 */
RouteDispatcher.prototype.add = function(url, method, handler) {
    if (handler === undefined) {
        handler = method;
        method = null;

        if (handler === undefined) {
            handler = url;
            url = null;
            method = null;
        }
    }

    this._routes.push({
        url: url,
        handler: handler,
        method: method,
        index: this._routes.length
    });
};

/**
 * Default HTTP handler
 * @param request Incoming HTTP server request
 * @param response Outgoing HTTP server request
 */
RouteDispatcher.prototype.handle = function(request, response) {

    this._extendResponse(response);
    this._handleRequest(request, response, 0);
};

/**
 * Internal HTTP handler. Finds the route and sets up parameters
 * for calling the first registered handler.
 * @param request Incoming HTTP request
 * @param response Outgoing HTTP request
 * @param startIndex Index in route array to start searching
 * @return N/A
 * @private
 */
RouteDispatcher.prototype._handleRequest = function(request, response, startIndex) {
    var normalizedRequest = _normalizedRequest(request);

    var route = this._findNextRoute(normalizedRequest, startIndex);
    if (route) {
        var next = function() {
            this._handleRequest(request, response, route.index + 1);
        }.bind(this);

        try {
            var p = route.handler(request, response, next);
            if (p && typeof(p.catch) === 'function') {
                p.catch(function(err) {
                    this.onError(err, request, response);
                }.bind(this));
            }
        }
        catch(err) {
            this.onError(err, request, response);
        }
    }
};

/**
 * Error handler. Responds with an HTTP 500.
 * @param err Error
 * @param request Incoming request
 * @param response Outgoing response
 */
 RouteDispatcher.prototype.onError = function(err, request, response) {
    log.error('Error handling route:', err);
    response.statusCode = 500;
    response.end('Error');
};

/**
 * Find the next route that matches the incoming request
 * @param request Normalized incoming HTTP request
 * @param startIndex Index in route array to start searching
 * @returns First matching route or null
 * @private
 */
RouteDispatcher.prototype._findNextRoute = function(request, startIndex) {

    for (var i = startIndex; i < this._routes.length ; ++i) {
        var route = this._routes[i];
        if (request.isMatch(route)) {
            return route;
        }
    }
    return null;
};

/**
 * Add helper methods to the response (e.g., sendJSON).
 * @param res
 * @private
 */
RouteDispatcher.prototype._extendResponse = function(res) {
    res.sendJSON = function(obj, statusCode) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = statusCode || 200;
        var json = typeof(obj) === 'string' ? obj : JSON.stringify(obj);
        res.end(json);

    };
};

/**
 * Helper so we only have to parse URL once when searching route table
 * @param url Request URL
 * @returns {{function: *}}
 * @private
 */
function _normalizedRequest(req) {
    var method = req.method;
    var url = req.url;
    var pos = url.indexOf('?');
    if (pos >= 0) {
        url = url.substr(0, pos);
    }
    url = url.toLowerCase();

    return {
        isMatch: function (route) {
            req.matches = null;

            if (route.method && route.method !== method) {
                return false;
            }

            if (route.url instanceof RegExp) {
                var matches = route.url.exec(url);
                if (matches) {
                    req.matches = [];
                    //regex matches is not actually an array--manual shift
                    for (var i = 1, len = matches.length ; i < len ; ++i) {
                        req.matches.push(matches[i]);
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return route.url == null || route.url === url;
            }
        }
    };
}

module.exports = RouteDispatcher;

