'use strict';

const FileRepository = require('../FileRepository');

/**
 * Simple user repository access backed by a file.
 *
 * JSON format:
 * {
 *   "users": [
 *     { "name": "admin", "password": "secret" }
 *   ]
 * }
 * @param fileName
 * @constructor
 * @extends FileRepository
 */
function UserFileRepository(fileName) {
    var opts = {
        id: 'name',
        parent: 'users',
        fileName: fileName
    };
    this._init(opts);
}

UserFileRepository.prototype = new FileRepository();

/**
 * Searches the data store for the user. Alias for findById
 * @param username
 * @return
 *  Promise that resolves to user object. If user is not
 *  found then the promises resolved to null.
 */
UserFileRepository.prototype.findByName = function(username) {
    return this.findById(username);
};

module.exports = UserFileRepository;

