/**
 * Simple body parser for the RouteDispatcher
 */
'use strict';

module.exports = {

    /**
     * Initializes the dispatcher
     * @param dispatcher
     * @param opts Options
     * @param opts.limit Maximum number of bytes (defaults to 1M)
     * @param opts.property Name of request property to set data (defaults to body)
     */
    init: function(dispatcher, opts) {
        opts = Object.assign({
            limit: 1000000,
            property: 'body'
        });

        var readBody = function(req, res, next) {

            var body = '';
            req.on('data', function(data) {
                body += data;
                if(body.length > opts.limit) {
                    body = '';
                    res.statusCode = 413;
                    res.end();
                    res.connection.destroy();
                }
            });

            req.on('error', function() {
                res.statusCode = 500;
                res.end();
            });

            req.on('end', function() {
                //
                // TODO: Ignoring content-type and only supporting JSON
                //
                try {
                    if (body && body.trim()) {
                        req[opts.property] = JSON.parse(body);
                    }
                }
                catch(err) {
                    res.statusCode = 400;
                    res.end('Invalid JSON');
                    return;
                }
                next();
            });

        };

        dispatcher.add(null, 'POST',readBody);
        dispatcher.add(null, 'PUT', readBody);
    }
};
