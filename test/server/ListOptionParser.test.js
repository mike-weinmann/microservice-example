/**
 * Dispatcher tests
 */
'use strict';

const assert = require(fromBase('test/_lib/assert'));
const ListOptionParser = require(fromBase('server/ListOptionParser'));

/**
 * Tests
 */
module.exports = {
    noParameters: function() {
        var opts = ListOptionParser.parse('');
        assert.isNotDefined(opts.limit);
        assert.isNotDefined(opts.start);
        assert.isNotDefined(opts.sort);
    },

    singleSort: function() {
        var opts = ListOptionParser.parse('?sort=abc');
        assert.isNotDefined(opts.limit);
        assert.isNotDefined(opts.start);
        assert.isDefined(opts.sort);
        assert.areEqual(1, opts.sort.length);
        assert.areEqual('abc', opts.sort[0].name);
        assert.areEqual(1, opts.sort[0].order);
    },

    all: function() {
        var opts = ListOptionParser.parse('?sort=abc,-def,+xyz&limit=10&start=5&something=else');
        assert.areEqual(10, opts.limit);
        assert.areEqual(5, opts.start);
        assert.isDefined(opts.sort);
        assert.areEqual(3, opts.sort.length);
        assert.areEqual('abc', opts.sort[0].name);
        assert.areEqual(1, opts.sort[0].order);
        assert.areEqual('def', opts.sort[1].name);
        assert.areEqual(-1, opts.sort[1].order);
        assert.areEqual('xyz', opts.sort[2].name);
        assert.areEqual(1, opts.sort[2].order);
    }

};

