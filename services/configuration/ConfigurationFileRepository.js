'use strict';

const FileRepository = require('../FileRepository');

/**
 * Simple configuration repository access backed by a file with an in-memory
 * copy (i.e., works for a single process only)
 * @param fileName File name
 * @constructor
 * @extends FileRepository
 */
function ConfigurationFileRepository(fileName) {
    var opts = {
        id: 'name',
        parent: 'configurations',
        fileName: fileName
    };
    this._init(opts);
}

ConfigurationFileRepository.prototype = new FileRepository();

module.exports = ConfigurationFileRepository;