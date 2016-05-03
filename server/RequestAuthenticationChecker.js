/**
 * Route handler that verifies that the user is authenticated (and sets the user
 * property on the incoming request)
 */

'use strict';

module.exports = {
    /**
     * Creates the user checker.
     * @param opts
     * @returns {Function}
     */
    createChecker: function(opts) {
        opts = Object.assign({
            accessToken: 'x-access-token',
            userProperty: 'user'
        }, opts);

        return function(req, res, next) {
            var accessToken = req.headers[opts.accessToken.toLowerCase()];
            if (accessToken) {
                var session = opts.sessionManager.get(accessToken);
                if (session && session.user) {
                    req[opts.userProperty] = session.user;
                    return next();
                }
            }
            res.statusCode = 403;
            res.end();
        }
    }
};