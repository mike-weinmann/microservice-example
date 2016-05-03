'use strict';
/**
 * Simple logger (writes to console)
 */
module.exports = {
    log: function(level, message) {
        console.log('[' + level + '] ', message);
    },

    debug: function(message) {
        this.log('DEBUG', message);
    },

    info: function(message) {
        this.log('INFO', message);
    },

    warn: function(message) {
        this.warn('WARN', message);
    },

    error: function(message) {
        this.warn('WARN', message);
    }
};
