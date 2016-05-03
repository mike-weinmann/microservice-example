'use strict';

const assert = require(fromBase('test/_lib/assert'));
const arrays = require(fromBase('util/arrays'));

/**
 * Tests
 */
module.exports = {
    sortSingle: function() {
        var src = [
            {name: 'Alice', group: 'A', position: 1},
            {name: 'Bob', group: 'B', position: 2},
            {name: 'Charlie', group: 'C', position: 1},
            {name: 'Alan', group: 'C', position: 2},
            {name: 'Barbara', group: 'B', position: 1},
            {name: 'Cheryl', group: 'A', position: 2}

        ];
        arrays.sort(src, 'name');
        assert.areEqual('Alan', src[0].name, 'Where is Alan?');
        assert.areEqual('Alice', src[1].name, 'Where is Alice?');
        assert.areEqual('Barbara', src[2].name, 'Where is Barbara?');
        assert.areEqual('Bob', src[3].name, 'Where is Bob?');
        assert.areEqual('Charlie', src[4].name, 'Where is Charlie?');
        assert.areEqual('Cheryl', src[5].name, 'Where is Cheryl?');
    },

    sortSingleDescending: function() {
        var src = [
            {name: 'Alice', group: 'A', position: 1},
            {name: 'Bob', group: 'B', position: 2},
            {name: 'Charlie', group: 'C', position: 1},
            {name: 'Alan', group: 'C', position: 2},
            {name: 'Barbara', group: 'B', position: 1},
            {name: 'Cheryl', group: 'A', position: 2}

        ];
        arrays.sort(src, {name:'name', order:-1});
        assert.areEqual('Alan', src[5].name, 'Where is Alan?');
        assert.areEqual('Alice', src[4].name, 'Where is Alice?');
        assert.areEqual('Barbara', src[3].name, 'Where is Barbara?');
        assert.areEqual('Bob', src[2].name, 'Where is Bob?');
        assert.areEqual('Charlie', src[1].name, 'Where is Charlie?');
        assert.areEqual('Cheryl', src[0].name, 'Where is Cheryl?');
    },

    sortMultiple: function() {
        var src = [
            {name: 'Alice', group: 'A', position: 1},
            {name: 'Bob', group: 'B', position: 2},
            {name: 'Charlie', group: 'C', position: 1},
            {name: 'Alan', group: 'C', position: 2},
            {name: 'Barbara', group: 'B', position: 1},
            {name: 'Cheryl', group: 'A', position: 2}

        ];
        arrays.sort(src, 'position', 'group', 'name');
        assert.areEqual('Alice', src[0].name, 'Where is Alice?');
        assert.areEqual('Barbara', src[1].name, 'Where is Barbara?');
        assert.areEqual('Charlie', src[2].name, 'Where is Charlie?');
        assert.areEqual('Cheryl', src[3].name, 'Where is Cheryl?');
        assert.areEqual('Bob', src[4].name, 'Where is Bob?');
        assert.areEqual('Alan', src[5].name, 'Where is Alan?');
    },

    isNumber: function() {
        assert.isTrue(arrays.isNumber(5));
        assert.isTrue(arrays.isNumber(5.5));
        assert.isTrue(arrays.isNumber(new Number(10)));
        assert.isFalse(arrays.isNumber(null));
        assert.isFalse(arrays.isNumber("5"));
        assert.isFalse(arrays.isNumber(new Date()));
        assert.isFalse(arrays.isNumber(this));
    },

    compare: function() {
        assert.isTrue(arrays.compare(null, null) === 0);
        assert.isTrue(arrays.compare(null, '') < 0);
        assert.isTrue(arrays.compare('', null) > 0);
        assert.isTrue(arrays.compare(2, 10) < 0);
        assert.isTrue(arrays.compare('2', '10') > 0);
        assert.isTrue(arrays.compare(2, new Number(2)) === 0);
        assert.isTrue(arrays.compare('2', 2) === 0);
        assert.isTrue(arrays.compare(new Date(5), new Date(5)) === 0);
        assert.isTrue(arrays.compare('abc', 'abc') === 0);
        assert.isTrue(arrays.compare('abc', 'abcd') < 0);
    }

};
