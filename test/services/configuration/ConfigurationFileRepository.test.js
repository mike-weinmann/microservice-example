/**
 * ConfigurationFileRepository tests
 */
 
'use strict';

const path = require('path');
const assert = require(fromBase('test/_lib/assert'));
const ConfigurationFileRepository = require(fromBase('services/configuration/ConfigurationFileRepository'));

const dataFile = path.join(__dirname, 'configurations.test.json');

/**
 * Tests
 */
module.exports = {
    findById: function () {
        var rep = new ConfigurationFileRepository(dataFile);
        return rep.findById('host1a')
            .then(function (rec) {
                assert.isDefined(rec);
                assert.areEqual('host1a', rec.name, 'Name invalid');
                assert.areEqual('host1a.com', rec.hostname, 'Name invalid');
                assert.areEqual(1001, rec.port, 'Name invalid');
                assert.areEqual('user-a', rec.username, 'Name invalid');
            });
    }
};
