/**
 * ConfigurationService tests
 */
 
'use strict';

const path = require('path');
const assert = require(fromBase('test/_lib/assert'));
const fsCopy = require(fromBase('test/_lib/fs-copy'));
const ConfigurationService = require(fromBase('services/configuration/ConfigurationService'));
const ConfigurationFileRepository = require(fromBase('services/configuration/ConfigurationFileRepository'));

const dataFile = path.join(__dirname, 'configurations.test.json');
const copyDataFile = path.join(__dirname, 'configurations-copy.test.json');

/**
 * Helper method that searches the error array for a matching value.
 * @param errors Error array to search
 * @param property Error Property name to match (null means match anything)
 * @param message Error Message to match (null means match anything)
 * @returns {boolean} true, if error is found.
 */
function hasError(errors, property, message) {
    if (!errors) {
        return false;
    }

    for (var i = 0, len = errors.length ; i < len ; ++i) {
        var err = errors[i];
        if ((!property || property == err.property)
            && (!message || message == err.message)) {
            return true;
        }
    }
    return false;
}

/**
 * Creates a test configuration
 * @returns Promise that resolved to repository
 */
function createService() {
    return fsCopy.copy(dataFile, copyDataFile)
        .then(function() {
            var rep = new ConfigurationFileRepository(copyDataFile);
            return new ConfigurationService(rep);
        });
}

/**
 * Tests
 */
module.exports = {
    validate: function() {
        return createService()
            .then(function(svc) {
                var rec = {
                    name: 'a1',
                    hostname: 'a1.com',
                    port: 1,
                    username: 'somebody'
                };
                var errors = svc.validate(rec);
                assert.isNotDefined(errors);

            })


    },

    validateWithErrors: function() {
        return createService()
            .then(function(svc) {
                var rec = {};

                var errors = svc.validate(rec);
                assert.isDefined(errors);
                assert.isTrue(hasError(errors, 'name', 'Missing value'), 'name is valid');
                assert.isTrue(hasError(errors, 'hostname', 'Missing value'), 'hostname is valid');
                assert.isTrue(hasError(errors, 'username', 'Missing value'), 'user is valid');
                assert.isTrue(hasError(errors, 'port'), 'port is valid');
            });
    },

    findById: function() {
        return createService()
            .then(function(svc) {

                //validate that repository methods are exposed
                return svc.findById('host1a');
            })
            .then(function(rec) {
                assert.isDefined(rec);
                assert.areEqual('host1a', rec.name);
                assert.areEqual('host1a.com', rec.hostname);
                assert.areEqual(1001, rec.port);
                assert.areEqual('user-a', rec.username);
            });
    },

    count: function() {
        return createService()
            .then(function(svc) {

                //validate that repository methods are exposed
                return svc.count('host1a');
            })
            .then(function(val) {
                assert.isDefined(4, val);
            });
    },

    saveWithErrors: function() {
        return createService()
            .then(function(svc) {
                var rec = {};
                return svc.save(rec);
            })
            .then(function() {
                assert.fail('Unexpected save');
            })
            .catch(function(errors) {
                assert.isDefined(errors);
                assert.isTrue(hasError(errors, 'name', 'Missing value'), 'name is valid');
                assert.isTrue(hasError(errors, 'hostname', 'Missing value'), 'hostname is valid');
                assert.isTrue(hasError(errors, 'username', 'Missing value'), 'user is valid');
                assert.isTrue(hasError(errors, 'port'), 'port is valid');

            });
    },

    save: function() {
        var svc;
        return createService()
            .then(function(svc2) {
                svc = svc2;
                var rec = {
                    name: 'a1',
                    hostname: 'a1.com',
                    port: 1,
                    username: 'somebody'
                };
                return svc.save(rec);
            })
            .then(function() {
                return svc.findById('a1');
            })
            .then(function(rec2) {
               assert.isDefined(rec2);
                assert.areEqual('a1', rec2.name);
                assert.areEqual('a1.com', rec2.hostname);
                assert.areEqual(1, rec2.port);
                assert.areEqual('somebody', rec2.username);
            });
    }

};
