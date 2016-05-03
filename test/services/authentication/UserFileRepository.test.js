/**
 * UserFileRepository tests
 */
 
'use strict';
const path = require('path');
const assert = require(fromBase('test/_lib/assert'));
const UserFileRepository = require(fromBase('services/authentication/UserFileRepository'));

const dataFile = path.join(__dirname, 'users.test.json');

/**
 * Tests
 */
module.exports = {
    findByName: function() {
        var rep = new UserFileRepository(dataFile);
        return rep.findByName('admin')
            .then(function (user) {
                assert.isDefined(user, 'User not found');
                assert.areEqual('admin', user.name);
            });
    },

    findMissing: function() {
        var rep = new UserFileRepository(dataFile);
        return rep.findByName('xxxxxx')
            .then(function (user) {
                assert.isNotDefined(user, 'User Found');
            });
    },

    findAll: function() {
        var rep = new UserFileRepository(dataFile);
        return rep.find()
            .then(function (users) {
                assert.isDefined(users, 'No users array');
                assert.isTrue(users.length > 0, 'Empty user array');
            });
    }
};