'use strict';

const fs = require('fs');
const arrays = require('../util/arrays');

/**
 * Simple object repository access backed by a file with an in-memory
 * copy (i.e., works for a single process only)
 * @constructor
 */

function FileRepository() {}

/**
 * Initialize the data from the specified file.
 * This initializes the internal _data structure
 *
 * @param opts Service options
 * @param opts.fileName Name of the file for storing records
 * @param opts.id   Name of the id property
 * @param opts.parent Name of the parent property array in the JSON store
 */
FileRepository.prototype._init = function(opts) {
    this._options = opts;
    var fileName = opts.fileName;
    var id = opts.id;
    var parent = opts.parent;

    this._data = new Promise(function(resolve, reject) {

        fs.readFile(fileName, 'utf8', function (err,data) {
            if (err) {
                return reject(err);
            }
            else {
                try {
                    var json = JSON.parse(data);
                    var records = (parent ? json[parent] : json) || [];
                    var idLookup = {};
                    if (id) {
                        for (var i = 0, len = records.length ; i < len ; ++i) {
                            var rec = records[i];
                            idLookup[rec[id]] = i;
                        }
                    }
                    resolve({
                        records: records,
                        idLookup: idLookup
                    });
                }
                catch(err) {
                    return reject(err);
                }
            }
        });
    });
};

/**
 * Finds record with primary id value
 * @param id Record identifier
 * @return Promise the resolves to id or null if not found
 */
FileRepository.prototype.findById = function(id) {
    return this._data
        .then(function(data) {
            var index = data.idLookup[id];
            return index >= 0 ? data.records[index] : null;
        });
};

/**
 * Finds all records
 * @param opts Find options
 * @param opts.sort Name of property to sort
 * @param opts.start Record to start with (zero based)
 * @param opts.limit Maximum number of records to return
 * @return Promise that resolve to matching records
 */
FileRepository.prototype.find = function(opts) {
    opts = opts || {};

    return this._data
        .then(function (data) {
            //create copy so we don't change with master array
            var records = data.records.slice();
            if (opts.sort) {
                arrays.sort(records, opts.sort);
            }
            var start = opts.start > 0 ? opts.start : 0;
            var limit = opts.limit > 0 ? opts.limit : records.length;
            if (start > 0 || limit < records.length) {
                var end = Math.min(start + limit, records.length);
                records = records.slice(start, end);
            }

            return records;
        }.bind(this));
};

/**
 * Returns the count of the records in the repository
 */
FileRepository.prototype.count = function() {
    return this._data
        .then(function(data) {
            return data.records.length;
        });
};

/**
 * Saves or updates the record
 * @param rec
 * @returns Promise that resolves to a boolean--true if update, false if inserted
 */
FileRepository.prototype.save = function(rec) {
    var idProperty = this._options.id;
    var updated;
    return this._data
        .then(function(data) {
            var id = rec[idProperty];
            var index = data.idLookup[id];
            if (index >= 0) {
                updated = true;
                data.records[index] = rec;
            }
            else {
                updated = false;
                data.idLookup[id] = data.records.length;
                data.records.push(rec);
            }
            return this._saveFile();

        }.bind(this))
        .then(function() {
            return updated;
        });
};

/**
 * Deletes the record
 * @param id Id of record to delete
 * @returns Promise that resolves to a boolean--true if deleted, false if record was not found
 */
FileRepository.prototype.remove = function(id) {
    var exists;
    var idProperty = this._options.id;
    return this._data
        .then(function(data) {
            var index = data.idLookup[id];
            if (index >= 0) {
                exists = true;
                delete data.idLookup[id];
                data.records.splice(index, 1);
                //re-index
                for (var len = data.records.length ; index < len ; ++index) {
                    var id2 = data.records[index][idProperty];
                    data.idLookup[id2] = index;
                }
                return this._saveFile();
            }
        }.bind(this))
        .then(function() {
            return exists;
        });
};

/**
 * Saves the array back to the save file
 * @return Promise when complete
 * @private
 */
FileRepository.prototype._saveFile = function() {
    var parent = this._options.parent;
    var fileName = this._options.fileName;

    return new Promise(function(resolve, reject) {

        this._data
            .then(function(data) {
                var saveData;
                if (parent) {
                    saveData = {};
                    saveData[parent] = data.records;
                }
                else {
                    saveData = data.records;
                }
                try {
                    //Synchronous write to prevent multiple requests from updating concurrently
                    fs.writeFileSync(fileName, JSON.stringify(saveData), 'utf8');
                    resolve();
                } catch(err) {
                    reject(err);
                }
            });
    }.bind(this));
};

module.exports = FileRepository;