'use strict';

/**
 * Simple Session Manager using an in memory map for session.
 * @constructor
 */
function SessionMemoryManager() {
    this._sessions = {};
}

/**
 * Creates a new session
 * @returns {{_id}}
 */
SessionMemoryManager.prototype.create = function() {
    var session = {
        _id : this._nextId(),

        //
        // Use methods to set value so a Memory Manager
        // can respond to changes.
        set: function(key, val) {
            this[key] = val;
        },
        get: function(key) {
            return this[key];
        }
    };
    this._sessions[session._id] = session;
    return session;
};

/**
 * Gets the session with the specified identifier.
 * @param id
 * @returns Session object or null if session does not exists (or was removed)
 */
SessionMemoryManager.prototype.get = function(id) {
    return this._sessions[id];
};

/**
 * Removes the session associated with the identifier.
 * @param id
 */
SessionMemoryManager.prototype.remove = function(id) {
    delete this._sessions[id]
};

/**
 * Create a new session identifier (simple random number)
 * @returns {string}
 * @private
 */
SessionMemoryManager.prototype._nextId = function() {
    return Math.floor((1 + Math.random()) * 0x100000000)
        .toString(16)
        .substr(1);
};

module.exports = SessionMemoryManager;
