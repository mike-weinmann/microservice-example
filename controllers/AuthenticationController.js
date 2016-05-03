'use strict';

/**
 * Authentication controller and default routes (login/logout).
 *
 * Application authentication is controlled by an access token that
 * is tied to a shared session.
 *
 * An alternative to session is to use JWT like tokens which include the claims
 * with each request. The reasons are varied and we can discuss if curious (-mw)
 *
 * @param dispatcher RouteDispatcher
 * @param opts
 * @param opts.authenticator Required for authentication
 * @param opts.sessionManager Required for session manager
 * @constructor
 */
function AuthenticationController(dispatcher, opts) {
    this._options = Object.assign({
        baseUrl: '/v1/auth',
        accessToken: 'x-access-token'
    }, opts);

    this._initRoutes(dispatcher);
}

/**
 * Initializes the default routes for the controller
 * @param dispatcher Dispatcher to add the routes
 * @private
 */
AuthenticationController.prototype._initRoutes = function(dispatcher) {
    var baseUrl = this._options.baseUrl;
    dispatcher.add(baseUrl + '/login', 'POST', this.login.bind(this));
    dispatcher.add(baseUrl + '/logout', 'POST', this.logout.bind(this));
    dispatcher.add(baseUrl + '/me', 'GET', this.currentUser.bind(this));
};

/**
 * Login handler. Authenticates the credentials and creates a new
 * a access token and session.
 *
 * Request body should be JSON with username and password value.
 * @param req Request
 * @param res Response
 */
AuthenticationController.prototype.login = function(req, res) {

    var sessionManager = this._options.sessionManager;
    var authenticator = this._options.authenticator;
    var accessToken = this._options.accessToken;

    //login attempt should invalidate old token
    this._clearAccessToken(req);

    if (!req.body) {
        res.statusCode(400).end();
    }

    var username = req.body.username;
    var password = req.body.password;

    return authenticator.authenticate(username, password)
        .then(function(user) {
            if (user == null) {
                res.statusCode = 403;
                return res.end();
            }
            else {
                var session = sessionManager.create();
                session.set('user', user);
                var userResponse = {
                    username: user.name
                };
                userResponse[accessToken] = session._id;
                return res.sendJSON(userResponse);
            }
        }.bind(this))
        .catch(function() {
            res.statusCode = 403;
            return res.end();
        });
};

/**
 * Logout request handler. Invalidates the session associated with the
 * access token.
 *
 * @param req
 * @param res
 */
AuthenticationController.prototype.logout = function(req, res) {
    this._clearAccessToken(req);
    res.statusCode = 204;
    res.end();
};

/**
 * Test handler that will return the user associated with the current
 * (valid) access token.
 * @param req
 * @param res
 */
AuthenticationController.prototype.currentUser = function(req, res) {
    var accessToken = req.headers[this._options.accessToken.toLowerCase()];
    if (accessToken) {
        var session = this._options.sessionManager.get(accessToken);
        if (session && session.user) {
            return res.sendJSON({username: session.user.name});
        }
    }
    res.statusCode = 403;
    res.end();
};



/**
 * Clears out the access token and associated session.
 * @param req
 * @private
 */
AuthenticationController.prototype._clearAccessToken = function(req) {
    var accessToken = req.headers[this._options.accessToken.toLowerCase()];
    if (accessToken) {
        this._options.sessionManager.remove(accessToken);
    }
};

module.exports = {
    controller: AuthenticationController,
    create: function(dispatcher, opts) {
        return new AuthenticationController(dispatcher, opts);
    }
};
