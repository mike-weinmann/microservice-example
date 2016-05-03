/**
 * FileRepository tests
 */
'use strict';

const path = require('path');
const assert = require(fromBase('test/_lib/assert'));
const fsCopy = require(fromBase('test/_lib/fs-copy'));
const FileRepository = require(fromBase('services/FileRepository'));

const dataFile = path.join(__dirname, 'sample.test.json');
const copyDataFile = path.join(__dirname, 'sample-copy.test.json');

/**
 * Creates a test repository
 * @param copy Indicator to copy the source data (when updating)
 * @returns Promise that resolved to repository
 */
function createRepository(copy) {
    var p = copy ? fsCopy.copy(dataFile, copyDataFile) : Promise.resolve(true);

    return p.then(function() {
        var rep = new FileRepository();
        rep._init({
            id: 'name',
            parent: 'configurations',
            fileName: copy ? copyDataFile : dataFile
        });
        return rep;
    });
}

module.exports = {
    findById: function() {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.findById('host1a');
            })
            .then(function(rec) {
                assert.isDefined(rec);
                assert.areEqual('host1a', rec.name, 'Name invalid');
                assert.areEqual('host1a.com', rec.hostname, 'Name invalid');
                assert.areEqual(1001, rec.port, 'Name invalid');
                assert.areEqual('user-a', rec.username, 'Name invalid');
            });
    },

    findByIdNotFound: function() {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.findById('xxxxx');
            })
            .then(function(rec) {
                assert.isNotDefined(rec);
            });
    },

    findAll: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find();
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(4, records.length, 'Records error');
            });
    },

    findSort: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({sort: 'hostname'})
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(4, records.length, 'Records error');
                assert.areEqual('host1a.com', records[0].hostname, 'Where is host1a?');
                assert.areEqual('host1b.com', records[1].hostname, 'Where is host1b?');
                assert.areEqual('host2a.com', records[2].hostname, 'Where is host2a?');
                assert.areEqual('host2b.com', records[3].hostname, 'Where is host2b?');
            });
    },

    findLimit: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({
                    sort: 'hostname',
                    limit: 2
            })
            }).then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(2, records.length, 'Records error');
                assert.areEqual('host1a.com', records[0].hostname, 'Where is host1a?');
                assert.areEqual('host1b.com', records[1].hostname, 'Where is host1b?');
            });
    },

    findLimitBeyondMax: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({
                    sort: 'hostname',
                    limit: 99999
                });
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(4, records.length, 'Records error');
                assert.areEqual('host1a.com', records[0].hostname, 'Where is host1a?');
                assert.areEqual('host1b.com', records[1].hostname, 'Where is host1b?');
                assert.areEqual('host2a.com', records[2].hostname, 'Where is host2a?');
                assert.areEqual('host2b.com', records[3].hostname, 'Where is host2b?');
            });
    },

    findStartWithLimit: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({
                    sort: 'hostname',
                    start: 1,
                    limit: 2
                });
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(2, records.length, 'Records error');
                assert.areEqual('host1b.com', records[0].hostname, 'Where is host1b?');
                assert.areEqual('host2a.com', records[1].hostname, 'Where is host2a?');
            });
    },

    findStartWithLimitBeyondMax: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({
                    sort: 'hostname',
                    start: 1,
                    limit: 9999
                });
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(3, records.length, 'Records error');
                assert.areEqual('host1b.com', records[0].hostname, 'Where is host1b?');
                assert.areEqual('host2a.com', records[1].hostname, 'Where is host2a?');
                assert.areEqual('host2b.com', records[2].hostname, 'Where is host2b?');
            });
    },

    findStartWithNoLimit: function () {
        var rep;
        return createRepository()
            .then(function(rep2) {
                rep = rep2;
                return rep.find({
                    sort: 'hostname',
                    start: 1
                });
            })
            .then(function (records) {
                assert.isDefined(records, 'Records not found');
                assert.areEqual(3, records.length, 'Records error');
                assert.areEqual('host1b.com', records[0].hostname, 'Where is host1b?');
                assert.areEqual('host2a.com', records[1].hostname, 'Where is host2a?');
                assert.areEqual('host2b.com', records[2].hostname, 'Where is host2b?');
            });
    },

    create: function() {
        //use copy to not break other tests
        var rep;
        return createRepository(true)
            .then(function(rep2) {
                rep = rep2;
                return rep.save({
                    "name": "newhost",
                    "hostname": "newhost.com",
                    "port": 12001,
                    "username": "admin"
                });
            })
            .then(function() {
                return rep.findById('newhost');
            })
            .then(function(rec) {
                assert.isDefined(rec);
                assert.areEqual('newhost', rec.name);
                assert.areEqual('newhost.com', rec.hostname);
                assert.areEqual(12001, rec.port);
                assert.areEqual('admin', rec.username);

                return rep.count();
            })
            .then(function(count) {
                assert.areEqual(5, count);
            });
    },

    update: function() {
        //use copy to not break other tests
        var rep;
        return createRepository(true)
            .then(function(rep2) {
                rep = rep2;
                return rep.save({
                    "name": "host1a",
                    "hostname": "host1a.new.com",
                    "port": 12002,
                    "username": "user2"
                });
            })
            .then(function() {
                return rep.findById('host1a');
            })
            .then(function(rec) {
                assert.isDefined(rec);
                assert.areEqual('host1a', rec.name);
                assert.areEqual('host1a.new.com', rec.hostname);
                assert.areEqual(12002, rec.port);
                assert.areEqual('user2', rec.username);

                return rep.count();
            })
            .then(function(count) {
                assert.areEqual(4, count);
            });
    },

    remove: function() {
        //use copy to not break other tests
        var rep;
        return createRepository(true)
            .then(function(rep2) {
                rep = rep2;
                return rep.remove('host1a');
            })
            .then(function(exists) {
                assert.isTrue(exists, 'Record not found');
                return rep.findById('host1a');
            })
            .then(function(rec) {
                assert.isNotDefined(rec);
                return rep.count();
            })
            .then(function(count) {
                assert.areEqual(3, count);
            });
    }

};

