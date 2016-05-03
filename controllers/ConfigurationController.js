'use strict';

var ListOptionParser = require('../server/ListOptionParser');

/**
 * Configurations controller and default routes--standard REST endpoints.
 * with each request. The reasons are varied and we can discuss if curious (-mw)
 *
 * @param dispatcher RouteDispatcher
 * @param opts
 * @param opts.configurationService Provides access to configuration
 * @constructor
 */
function ConfigurationController(dispatcher, opts) {
    this._options = Object.assign({
        baseUrl: '/v1/configurations'
    }, opts);

    this._initRoutes(dispatcher);
}

/**
 * Initializes the default routes for the controller
 * @param dispatcher Dispatcher to add the routes
 * @private
 */
ConfigurationController.prototype._initRoutes = function(dispatcher) {
    var baseUrl = this._options.baseUrl;

    var idRegExp = new RegExp('^' + baseUrl + '/([-_a-zA-Z0-9]*)$');
    dispatcher.add(baseUrl, 'GET', this.list.bind(this));
    dispatcher.add(baseUrl + '/', 'GET', this.list.bind(this));
    dispatcher.add(idRegExp, 'GET', this.getById.bind(this));
    dispatcher.add(idRegExp, 'PUT', this.save.bind(this));
    dispatcher.add(idRegExp, 'DELETE', this.remove.bind(this));
};

/**
 * List (GET) handler
 * @param req Request
 * @param res Response
 */
ConfigurationController.prototype.list = function(req, res) {
    var opts;
    try {
        opts = ListOptionParser.parse(req);
    }
    catch(err) {
        res.statusCode = 400;
        return res.end('Invalid Paging Options');
    }

    return this._options.configurationService.find(opts)
        .then(function(records) {
            res.sendJSON({configurations:records});
        });
};

/**
 * Get a single record by id (name)
 *
 * @param req Request
 * @param res Response
 */
ConfigurationController.prototype.getById = function(req, res) {
    var id = req.matches[0];
    return this._options.configurationService.findById(id)
        .then(function(rec) {
            if (rec) {
                return res.sendJSON(rec);
            }
            else {
                res.statusCode = 404;
                res.end();
            }
        });
};

/**
 * Updates (create or modify)
 *
 * @param req Request
 * @param res Response
 */
ConfigurationController.prototype.save = function(req, res) {
    var baseUrl = this._options.baseUrl;
    var id = req.matches[0];
    var rec = req.body || {};

    //
    // Override username with current user
    if (req.user && req.user.name) {
        rec.username = req.user.name;
    }

    rec.name = id;
    return this._options.configurationService.save(rec)
        .then(function(updated) {
            if (updated) {
                res.statusCode = 204;
                return res.end();
            }
            else {
                res.setHeader('Location', baseUrl + '/' + rec.name);
                res.sendJSON(rec, 201);
            }
        })
        .catch(function(errors) {
           if (errors.length > 0) {
               return res.sendJSON({errors: errors}, 400);
           } else {
               throw errors;
           }
        });

};


/**
 * Removes the record
 *
 * @param req Request
 * @param res Response
 */
ConfigurationController.prototype.remove = function(req, res) {
    var id = req.matches[0];
    return this._options.configurationService.remove(id)
        .then(function(deleted) {
            if (deleted) {
                res.statusCode = 204;
            }
            else {
                res.statusCode = 404;
            }
            return res.end();
        });

};

module.exports = {
    controller: ConfigurationController,
    create: function(dispatcher, opts) {
        return new ConfigurationController(dispatcher, opts);
    }
};
