'use strict';

const MAX_PORT = 19999;

/**
 * Service (business) methods for managing Configuration objects
 * @param repository Repository for retrieving/storing records
 * @constructor
 */
function ConfigurationService(repository) {
    this._repository = repository;

    //
    //Expose CRUD operations from the repository
    // (except for 'save' which is extended)
    var methods = ['find', 'findById', 'count', 'remove'];
    methods.forEach(function(name) {
        this[name] = function() {
            return repository[name].apply(repository, arguments);
        }
    }.bind(this));
}

/**
 * Validates the configuration record
 * @param rec
 * @returns {Array} Error object (null if no errors)
 */
ConfigurationService.prototype.validate = function(rec) {
    var errors = [];
    var requiredProperties = ['name', 'hostname', 'username'];
    requiredProperties.forEach(function(name) {
        if (!rec[name]) {
            errors.push({property:name, message: 'Missing value'});
        }
    });

    if (rec.port == null || rec.port < 0 || rec.post > MAX_PORT) {
        errors.push({property: 'port', message: 'Port number is invalid'});
    }

    return errors.length ? errors : null;
};

/**
 * Save the record (calls validate prior to saving)
 * @param rec
 * @returns Promise
 */
ConfigurationService.prototype.save = function(rec) {
    var errors = this.validate(rec);
    if (errors) {
        return Promise.reject(errors);
    }
    return this._repository.save(rec);
};

module.exports = ConfigurationService;