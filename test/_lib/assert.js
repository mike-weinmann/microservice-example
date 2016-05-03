'use strict';

/**
 * Simple assertion library to help unit testing.
 */
module.exports = {
    fail: function(message) {
        throw new Error(message || 'Failure');
    },

    isTrue: function(val, message) {
        if (!val) {
            throw new Error(message || 'Expected true');
        }
    },

    isFalse: function(val, message) {
        if (val) {
            throw new Error(message || 'Expected false');
        }
    },

    areEqual: function(expectedVal, val, message) {
        if (expectedVal != val) {
            throw new Error(message || 'Expected "' + expectedVal + '", actual"' + val + '"');
        }
    },

    isDefined: function(val, message) {
        if (val === undefined || val === null) {
            throw new Error(message || 'Value not defined');
        }
    },

    isNotDefined: function(val, message) {
        if (val !== undefined && val !== null) {
            throw new Error(message || 'Value defined');
        }
    }
};